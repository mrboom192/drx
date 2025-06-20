/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

import { UserRecord } from "firebase-admin/auth";
import { nanoid } from "nanoid";

import { onCall, onRequest } from "firebase-functions/v2/https";

const functions = require("firebase-functions/v1");
import { Change, EventContext } from "firebase-functions/v1";
const admin = require("firebase-admin");
const { Logging } = require("@google-cloud/logging");
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
const logging = new Logging({
  projectId: process.env.GCLOUD_PROJECT,
});
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

admin.initializeApp();

/**
 * When a user is created, create a Stripe customer object for them.
 *
 * @see https://stripe.com/docs/payments/save-and-reuse#web-create-customer
 */
export const createStripeCustomer = functions.auth
  .user()
  .onCreate(async (user: UserRecord) => {
    const customer = await stripe.customers.create({ email: user.email });

    const intent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    await admin.firestore().collection("stripe_customers").doc(user.uid).set({
      customer_id: customer.id,
      setup_secret: intent.client_secret,
    });
    return;
  });

/**
 * When adding the payment method ID on the client,
 * this function is triggered to retrieve the payment method details.
 */
export const addPaymentMethodDetails = functions.firestore
  .document("/stripe_customers/{userId}/payment_methods/{pushId}")
  .onCreate(async (snap: QueryDocumentSnapshot, context: EventContext) => {
    try {
      const paymentMethodId = snap.data().id;
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodId
      );
      await snap.ref.set(paymentMethod);
      // Create a new SetupIntent so the customer can add a new method next time.
      const intent = await stripe.setupIntents.create({
        customer: `${paymentMethod.customer}`,
      });

      const parentDocRef = snap.ref.parent.parent;

      if (parentDocRef) {
        await parentDocRef.set(
          {
            setup_secret: intent.client_secret,
          },
          { merge: true }
        );
      } else {
        throw new Error("Parent document reference is null.");
      }
      return;
    } catch (error) {
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      await reportError(error, { user: context.params.userId });
    }
  });

/**
 * When a payment document is written on the client,
 * this function is triggered to create the payment in Stripe.
 *
 * @see https://stripe.com/docs/payments/save-and-reuse#web-create-payment-intent-off-session
 */

// [START chargecustomer]

export const createStripePayment = functions.firestore
  .document("stripe_customers/{userId}/payments/{pushId}")
  .onCreate(async (snap: QueryDocumentSnapshot, context: EventContext) => {
    const { amount, currency, payment_method } = snap.data();
    try {
      // Look up the Stripe customer id.
      const parentDocRef = snap.ref.parent.parent;
      if (!parentDocRef) {
        throw new Error("Parent document reference is null.");
      }
      const parentDocSnap = await parentDocRef.get();
      const parentDocData = parentDocSnap.data();
      if (!parentDocData || !parentDocData.customer_id) {
        throw new Error("Customer ID not found in parent document.");
      }
      const customer = parentDocData.customer_id;

      // Create a charge using the pushId as the idempotency key
      // to protect against double charges.
      const idempotencyKey = context.params.pushId;
      const payment = await stripe.paymentIntents.create(
        {
          amount,
          currency,
          customer,
          payment_method,
          off_session: false,
          confirm: true,
          confirmation_method: "manual",
        },
        { idempotencyKey }
      );

      // If the result is successful, write it back to the database.
      await snap.ref.set(payment);
    } catch (error) {
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception to Error Reporting.
      functions.logger.log(error);
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      await reportError(error, { user: context.params.userId });
    }
  });

// [END chargecustomer]

/**
 * When 3D Secure is performed, we need to reconfirm the payment
 * after authentication has been performed.
 *
 * @see https://stripe.com/docs/payments/accept-a-payment-synchronously#web-confirm-payment
 */
export const confirmStripePayment = functions.firestore
  .document("stripe_customers/{userId}/payments/{pushId}")
  .onUpdate(async (change: Change<QueryDocumentSnapshot>) => {
    if (change.after.data().status === "requires_confirmation") {
      const payment = await stripe.paymentIntents.confirm(
        change.after.data().id
      );
      change.after.ref.set(payment);
    }
  });

/**
 * When a user deletes their account, clean up after them
 */
export const cleanupUser = functions.auth
  .user()
  .onDelete(async (user: UserRecord) => {
    const dbRef = admin.firestore().collection("stripe_customers");
    const customer = (await dbRef.doc(user.uid).get()).data();
    await stripe.customers.del(customer.customer_id);
    // Delete the customers payments & payment methods in firestore.
    const batch = admin.firestore().batch();
    const paymentsMethodsSnapshot = await dbRef
      .doc(user.uid)
      .collection("payment_methods")
      .get();

    paymentsMethodsSnapshot.forEach((snap: QueryDocumentSnapshot) =>
      batch.delete(snap.ref)
    );
    const paymentsSnapshot = await dbRef
      .doc(user.uid)
      .collection("payments")
      .get();
    paymentsSnapshot.forEach((snap: QueryDocumentSnapshot) =>
      batch.delete(snap.ref)
    );

    await batch.commit();

    await dbRef.doc(user.uid).delete();
    return;
  });

/**
 * To keep on top of errors, we should raise a verbose error report with Error Reporting rather
 * than simply relying on functions.logger.error. This will calculate users affected + send you email
 * alerts, if you've opted into receiving them.
 */

// [START reporterror]

function reportError(err: any, context = {}) {
  // This is the name of the log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by Error Reporting.
  const logName = "errors";
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: "cloud_function",
      labels: { function_name: process.env.FUNCTION_NAME },
    },
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: "cloud_function",
    },
    context: context,
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error: any) => {
      if (error) {
        return reject(error);
      }
      return resolve(undefined);
    });
  });
}

// [END reporterror]

/**
 * Sanitize the error message for the user.
 */
function userFacingMessage(error: any) {
  return error.type
    ? error.message
    : "An error occurred, developers have been alerted";
}

/**
 * Generate a PaymentIntent for Stripe.
 * This is used to display the Stripe PaymentSheet to the user.
 */
export const getPaymentIntent = onCall(async (request) => {
  // Only authenticated users
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to create a PaymentIntent"
    );
  }

  const uid = request.auth.uid;
  const { amount, currency, metadata } = request.data;

  // Basic validation
  if (!amount || !currency || typeof amount !== "number") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Amount and currency are required and must be valid."
    );
  }

  try {
    // Get the Stripe customer_id from Firestore
    const customerDoc = await admin
      .firestore()
      .collection("stripe_customers")
      .doc(uid)
      .get();

    if (!customerDoc.exists || !customerDoc.data()?.customer_id) {
      throw new functions.https.HttpsError(
        "not-found",
        "Stripe customer ID not found for this user."
      );
    }

    const customerId = customerDoc.data().customer_id;

    // Create an ephemeral key
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: "2020-08-27" }
    );

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.floor(amount * 100), // convert dollars to cents
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return {
      paymentIntentId: paymentIntent.id,
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
    };
  } catch (err) {
    console.error("Failed to create PaymentIntent:", err);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to create PaymentIntent"
    );
  }
});

/**
 * Cancel a PaymentIntent.
 * This is used to cancel a payment that is in progress.
 * Id, which is the payment intent ID, is passed from the client.
 */
export const cancelPaymentIntent = onCall(async (request) => {
  const { id } = request.data;
  try {
    await stripe.paymentIntents.cancel(id);
    return { id, message: "Canceled" };
  } catch (error) {
    throw new functions.https.HttpsError("unknown", error);
  }
});

/**
 * Webhook to handle Stripe events.
 * Handle events like payment success, failure, etc.
 */
export const handleStripeWebhook = onRequest(
  { cors: true },
  async (req, res) => {
    const stripeSigningSecret =
      process.env.STRIPE_HANDLE_EVENT_SECRET_DEVELOPMENT;

    if (!stripeSigningSecret) {
      console.error("Missing Stripe signing secret for environment");
      res.status(500).send("Server misconfiguration.");
      return;
    }

    let signature = req.headers["stripe-signature"];

    if (!signature) {
      res.status(400).send("Missing Stripe signature header.");
      return;
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody, // req.body will cause an error
        signature,
        stripeSigningSecret
      );

      // logic to handle the event here
      let paymentIntent = null;
      switch (event.type) {
        case "payment_intent.created":
          paymentIntent = event.data.object;
          functions.logger.log("Payment Intent Created", paymentIntent.id);
          break;
        case "payment_intent.succeeded":
          paymentIntent = event.data.object;
          functions.logger.log("Payment Intent Succeeded", paymentIntent.id);

          const metadata = paymentIntent.metadata;

          const patientId = metadata?.patientId;
          const doctorId = metadata?.doctorId;
          const dateStr = metadata?.date;
          const timeSlotStr = metadata?.timeSlot;

          if (!patientId || !doctorId || !dateStr || !timeSlotStr) {
            console.warn("Missing metadata fields for appointment creation");
            res.status(400).send("Missing required metadata");
            return;
          }

          try {
            const [doctorSnap, patientSnap] = await Promise.all([
              admin
                .firestore()
                .collection("publicProfiles")
                .doc(doctorId)
                .get(),
              admin.firestore().collection("users").doc(patientId).get(),
            ]);

            if (!doctorSnap.exists || !patientSnap.exists) {
              console.error("Doctor or patient does not exist");
              res.status(404).send("Doctor or patient not found");
              return;
            }

            const doctor = doctorSnap.data();
            const patient = patientSnap.data();
            const timeSlot = JSON.parse(timeSlotStr);
            const date = new Date(dateStr);

            const batch = admin.firestore().batch();

            const appointmentRef = admin
              .firestore()
              .collection("appointments")
              .doc();

            const appointmentData = {
              doctorId,
              patientId,
              doctor: {
                firstName: doctor.firstName,
                lastName: doctor.lastName,
              },
              patient: {
                firstName: patient.firstName,
                lastName: patient.lastName,
                image: patient.image || null,
              },
              timeSlot,
              date: admin.firestore.Timestamp.fromDate(date),
              price: doctor.consultationPrice,
              status: "confirmed",
              createdAt: admin.firestore.Timestamp.now(),
              // scheduledFor: admin.firestore.Timestamp.fromDate(
              //   new Date(date.setHours(parseInt(timeSlot.start.split(":")[0])))
              // ),
            };

            batch.set(appointmentRef, appointmentData);

            // Create chat
            const chatId = [doctorId, patientId].sort().join("_");
            const chatRef = admin.firestore().collection("chats").doc(chatId);
            const chatSnap = await chatRef.get();

            if (!chatSnap.exists) {
              batch.set(chatRef, {
                users: [patientId, doctorId],
                participants: {
                  doctor: {
                    uid: doctorId,
                    firstName: doctor.firstName,
                    lastName: doctor.lastName,
                    image: doctor.image || null,
                  },
                  patient: {
                    uid: patientId,
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    image: patient.image || null,
                  },
                },
                lastMessage: {
                  text: "New consultation created",
                  senderId: "system",
                  timestamp: admin.firestore.FieldValue.serverTimestamp(),
                },
                status: "ongoing",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });
            }

            const messageId = nanoid();
            const messageRef = chatRef.collection("messages").doc(messageId);

            batch.set(messageRef, {
              id: messageId,
              text: "New consultation created",
              senderId: "system",
              createdAt: admin.firestore.Timestamp.now(),
              system: true,
              sent: false,
              received: false,
              pending: true,
            });

            // Update the doctor's patient list
            const patientMedicalRecordRef = admin
              .firestore()
              .collection("records")
              .doc(patientId);

            batch.set(
              patientMedicalRecordRef,
              { doctorIds: admin.firestore.FieldValue.arrayUnion(doctorId) },
              { merge: true }
            );

            await batch.commit();
            functions.logger.log("Appointment and chat successfully created");

            res.status(200).send("Appointment created");
            return;
          } catch (err) {
            console.error("Error creating appointment:", err);
            res.status(500).send("Internal server error");
            return;
          }

        case "payment_intent.canceled":
          paymentIntent = event.data.object;
          functions.logger.log("Payment Intent Cancelled", paymentIntent.id);
          break;
        default:
          functions.logger.log("Unhandled event type", event.type);
          break;
      }

      res.send();
      return;
    } catch (error) {
      // Don't throw, just respond with error
      res.status(400).send(`Error constructing Stripe event: ${error}`);
      return;
    }
  }
);
