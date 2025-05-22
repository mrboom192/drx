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
admin.initializeApp();
const { Logging } = require("@google-cloud/logging");
const logging = new Logging({
  projectId: process.env.GCLOUD_PROJECT,
});

const { Stripe } = require("stripe");

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2020-08-27",
});

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
const TURN_KEY_ID = functions.config().turn.key_id;
const TURN_API_TOKEN = functions.config().turn.api_token;

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
  const { amount, currency } = data;

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
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
      publishableKey: functions.config().stripe.pk,
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
 * Generate a SetupIntent for Stripe.
 * This is used to create a payment method for the user.
 */
