"use strict";

import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/firestore";
import { defineSecret } from "firebase-functions/params";
import { UserRecord } from "firebase-admin/auth";
import { log } from "firebase-functions/logger";
import { nanoid } from "nanoid";
import { admin } from "../lib/admin";

import Stripe from "stripe";

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeSigningSecret = defineSecret("STRIPE_SIGNING_SECRET");

/**
 * When a user is created, create a Stripe customer object for them.
 *
 * @see https://stripe.com/docs/payments/save-and-reuse#web-create-customer
 */
export const createStripeCustomer = onDocumentCreated(
  {
    document: "users/{userId}",
    secrets: [stripeSecretKey],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }

    const stripe = new Stripe(stripeSecretKey.value());

    const user = snapshot.data() as UserRecord;

    const customer = await stripe.customers.create({ email: user.email });

    const intent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    await admin.firestore().collection("stripe_customers").doc(user.uid).set({
      customer_id: customer.id,
      setup_secret: intent.client_secret,
    });
    return;
  }
);

/**
 * Generate a PaymentIntent for Stripe.
 * This is used to display the Stripe PaymentSheet to the user.
 */
export const getPaymentIntent = onCall(
  { secrets: [stripeSecretKey] },
  async (request) => {
    // Only authenticated users
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated to create a PaymentIntent"
      );
    }

    const uid = request.auth.uid;
    const { amount, currency, metadata } = request.data;

    // Basic validation
    if (!amount || !currency || typeof amount !== "number") {
      throw new HttpsError(
        "invalid-argument",
        "Amount and currency are required and must be valid."
      );
    }

    const stripe = new Stripe(stripeSecretKey.value());

    try {
      // Get the Stripe customer_id from Firestore
      const customerDoc = await admin
        .firestore()
        .collection("stripe_customers")
        .doc(uid)
        .get();

      if (!customerDoc.exists || !customerDoc.data()) {
        throw new HttpsError(
          "not-found",
          "Stripe customer ID not found for this user."
        );
      }

      const customerId = customerDoc.data()?.customer_id;

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
      throw new HttpsError("internal", "Unable to create PaymentIntent");
    }
  }
);

/**
 * Cancel a PaymentIntent.
 * This is used to cancel a payment that is in progress.
 * Id, which is the payment intent ID, is passed from the client.
 */
export const cancelPaymentIntent = onCall(
  { secrets: [stripeSecretKey] },
  async (request) => {
    const { id } = request.data;
    const stripe = new Stripe(stripeSecretKey.value());

    try {
      await stripe.paymentIntents.cancel(id);
      return { id, message: "Canceled" };
    } catch (error) {
      throw new HttpsError("unknown", "Failed to cancel payment intent");
    }
  }
);

/**
 * Webhook to handle Stripe events.
 * Handle events like payment success, failure, etc.
 */
export const handleStripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeSigningSecret], cors: true },
  async (req, res) => {
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
    const stripe = new Stripe(stripeSecretKey.value());

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody, // req.body will cause an error
        signature,
        stripeSigningSecret.value()
      );

      // logic to handle the event here
      let paymentIntent = null;
      switch (event.type) {
        case "payment_intent.created":
          paymentIntent = event.data.object;
          log("Payment Intent Created", paymentIntent.id);
          break;
        case "payment_intent.succeeded":
          paymentIntent = event.data.object;
          log("Payment Intent Succeeded", paymentIntent.id);

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

            if (!doctor || !patient) {
              console.error("Doctor or patient data is missing");
              res.status(404).send("Doctor or patient data not found");
              return;
            }

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
            log("Appointment and chat successfully created");

            res.status(200).send("Appointment created");
            return;
          } catch (err) {
            console.error("Error creating appointment:", err);
            res.status(500).send("Internal server error");
            return;
          }

        case "payment_intent.canceled":
          paymentIntent = event.data.object;
          log("Payment Intent Cancelled", paymentIntent.id);
          break;
        default:
          log("Unhandled event type", event.type);
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
