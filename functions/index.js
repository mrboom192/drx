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

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const axios = require("axios");
const { Logging } = require("@google-cloud/logging");
const logging = new Logging({
  projectId: process.env.GCLOUD_PROJECT,
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { nanoid } = require("nanoid");

const { NODE_ENV } = process.env;
const stripeSigningSecret =
  process.env[`STRIPE_HANDLE_EVENT_SECRET_${NODE_ENV}`];

admin.initializeApp();

/**
 * When a user is created, create a Stripe customer object for them.
 *
 * @see https://stripe.com/docs/payments/save-and-reuse#web-create-customer
 */
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
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
exports.addPaymentMethodDetails = functions.firestore
  .document("/stripe_customers/{userId}/payment_methods/{pushId}")
  .onCreate(async (snap, context) => {
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
      await snap.ref.parent.parent.set(
        {
          setup_secret: intent.client_secret,
        },
        { merge: true }
      );
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

exports.createStripePayment = functions.firestore
  .document("stripe_customers/{userId}/payments/{pushId}")
  .onCreate(async (snap, context) => {
    const { amount, currency, payment_method } = snap.data();
    try {
      // Look up the Stripe customer id.
      const customer = (await snap.ref.parent.parent.get()).data().customer_id;
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
exports.confirmStripePayment = functions.firestore
  .document("stripe_customers/{userId}/payments/{pushId}")
  .onUpdate(async (change, context) => {
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
exports.cleanupUser = functions.auth.user().onDelete(async (user) => {
  const dbRef = admin.firestore().collection("stripe_customers");
  const customer = (await dbRef.doc(user.uid).get()).data();
  await stripe.customers.del(customer.customer_id);
  // Delete the customers payments & payment methods in firestore.
  const batch = admin.firestore().batch();
  const paymentsMethodsSnapshot = await dbRef
    .doc(user.uid)
    .collection("payment_methods")
    .get();
  paymentsMethodsSnapshot.forEach((snap) => batch.delete(snap.ref));
  const paymentsSnapshot = await dbRef
    .doc(user.uid)
    .collection("payments")
    .get();
  paymentsSnapshot.forEach((snap) => batch.delete(snap.ref));

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

function reportError(err, context = {}) {
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
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}

// [END reporterror]

/**
 * Sanitize the error message for the user.
 */
function userFacingMessage(error) {
  return error.type
    ? error.message
    : "An error occurred, developers have been alerted";
}

/**
 * Generate TURN credentials for the WebRTC connection.
 */
const TURN_KEY_ID = process.env.TURN_KEY_ID;
const TURN_API_TOKEN = process.env.TURN_API_TOKEN;

exports.getTurnCredentials = functions.https.onCall(async (data, context) => {
  // Ensure that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only authenticated users can request TURN credentials"
    );
  }

  try {
    const response = await axios.post(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${TURN_KEY_ID}/credentials/generate-ice-servers`,
      { ttl: 3600 }, // 1 hour
      {
        headers: {
          Authorization: `Bearer ${TURN_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // contains `iceServers` array
  } catch (err) {
    console.error("TURN credential generation failed:", err);
    throw new functions.https.HttpsError(
      "internal",
      "TURN credentials could not be generated"
    );
  }
});

/**
 * Generate a PaymentIntent for Stripe.
 * This is used to display the Stripe PaymentSheet to the user.
 */
exports.getPaymentIntent = functions.https.onCall(async (data, context) => {
  // Only authenticated users
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to create a PaymentIntent"
    );
  }

  const uid = context.auth.uid;
  const { amount, currency, metadata } = data;

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
exports.cancelPaymentIntent = functions.https.onCall(async (data, context) => {
  const { id } = data;
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
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripeSigningSecret =
    process.env.STRIPE_HANDLE_EVENT_SECRET_DEVELOPMENT;

  if (!stripeSigningSecret) {
    console.error("Missing Stripe signing secret for environment");
    return res.status(500).send("Server misconfiguration.");
  }

  let signature = req.headers["stripe-signature"];

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
          return res.status(400).send("Missing required metadata");
        }

        try {
          const [doctorSnap, patientSnap] = await Promise.all([
            admin.firestore().collection("publicProfiles").doc(doctorId).get(),
            admin.firestore().collection("users").doc(patientId).get(),
          ]);

          if (!doctorSnap.exists || !patientSnap.exists) {
            console.error("Doctor or patient does not exist");
            return res.status(404).send("Doctor or patient not found");
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
            scheduledFor: admin.firestore.Timestamp.fromDate(
              new Date(
                date.setHours(parseInt(timeSlot.startTime.split(":")[0]))
              )
            ),
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

          return res.status(200).send("Appointment created");
        } catch (err) {
          console.error("Error creating appointment:", err);
          return res.status(500).send("Internal server error");
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
  } catch (error) {
    throw new functions.https.HttpsError(
      "unknown",
      `Error constructing Stripe event: ${error}`
    );
  }
});

/**
 * Function to handle call notifications.
 * This function is triggered when a call is initiated.
 */
exports.sendCallNotification = functions.https.onCall(async (data, context) => {
  try {
    // Ensure the user is logged in
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }

    const { calleeId, callId, lastName } = data;

    if (!calleeId || !lastName) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing calleeId or lastName."
      );
    }

    const calleeDoc = await admin
      .firestore()
      .collection("users")
      .doc(calleeId)
      .get();

    if (!calleeDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Callee not found.");
    }

    const calleeData = calleeDoc.data();
    const calleeTokens = calleeData.expoPushTokens || [];

    if (calleeTokens.length === 0) {
      throw new functions.https.HttpsError(
        "not-found",
        "No Expo push tokens for the callee."
      );
    }

    // Notification payload
    const messages = calleeTokens.map((token) => ({
      to: token,
      sound: "default",
      title: "DrX Telehealth",
      body: `Dr. ${lastName} is calling...`,
      data: {
        type: "call",
        calleeId,
        callId,
      },
    }));

    const axios = require("axios");
    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      messages,
      { headers: { "Content-Type": "application/json" } }
    );

    // Remove token if that device is not registered
    for (const ticket of response.data.data) {
      if (
        ticket.status === "error" &&
        ticket.details?.error === "DeviceNotRegistered"
      ) {
        await admin
          .firestore()
          .collection("users")
          .doc(calleeId)
          .update({
            expoPushTokens: admin.firestore.FieldValue.arrayRemove(ticket.to),
          });
      }
    }
  } catch (error) {
    console.error("Error sending call notification:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send call notification."
    );
  }
});

/**
 * Function to handle messaging notifications.
 */
exports.sendMessageNotification = functions.firestore
  .document("chats/{chatId}/messages/{messageId}")
  .onCreate(async (snap, context) => {
    const messageData = snap.data();
    const { senderId, receiverId, text } = messageData;

    if (!receiverId || !senderId) {
      console.error("Missing receiverId or senderId in message data");
      return;
    }

    // Fetch the receiver's push tokens from Firestore
    const receiverDoc = await admin
      .firestore()
      .collection("users")
      .doc(receiverId)
      .get();
    if (!receiverDoc.exists) {
      console.error("Receiver not found:", receiverId);
      return;
    }
    const receiverData = receiverDoc.data();
    const expoTokens = receiverData.expoPushTokens || [];
    if (expoTokens.length === 0) {
      console.log("No Expo push tokens for this user.");
      return;
    }

    // Fetch the sender's last name from Firestore (assuming sender is a doctor)
    const senderDoc = await admin
      .firestore()
      .collection("users")
      .doc(senderId)
      .get();
    let senderLastName = "Unknown";
    if (senderDoc.exists) {
      const senderData = senderDoc.data();
      senderLastName = senderData.lastName || "Unknown";
    }

    // Prepare notification messages with custom title
    const messages = expoTokens.map((token) => ({
      to: token,
      sound: "default",
      title: `Dr. ${senderLastName}`, // Custom title
      body: `${text}`,
      data: {
        type: "message",
        senderId,
        chatId: context.params.chatId,
      },
    }));

    try {
      const axios = require("axios");
      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        messages,
        { headers: { "Content-Type": "application/json" } }
      );

      // Handle unregistered devices
      for (const ticket of response.data.data) {
        if (
          ticket.status === "error" &&
          ticket.details?.error === "DeviceNotRegistered"
        ) {
          await admin
            .firestore()
            .collection("users")
            .doc(receiverId)
            .update({
              expoPushTokens: admin.firestore.FieldValue.arrayRemove(ticket.to),
            });
        }
      }
    } catch (error) {
      console.error("Error sending message notification:", error);
    }
  });
