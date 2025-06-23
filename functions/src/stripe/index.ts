"use strict";

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/firestore";
import { defineSecret } from "firebase-functions/params";
import { UserRecord } from "firebase-admin/auth";
import { admin } from "../lib/admin";

import Stripe from "stripe";

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY_TEST");

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

export { handleStripeWebhook } from "./handleStripeWebhook.js";
