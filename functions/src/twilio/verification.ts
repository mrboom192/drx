// Download the helper library from https://www.twilio.com/docs/node/install
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const SERVICE_SID = "VAcfd0e21fd008dedb3fca5a7413936a4e";
const accountSid = defineSecret("TWILIO_ACCOUNT_SID");
const authToken = defineSecret("TWILIO_AUTH_TOKEN");

const createVerification = onCall(
  { secrets: [accountSid, authToken] },
  async (request) => {
    const phoneNumber = request.data?.phoneNumber;
    const locale = request.data?.locale || "en"; // Default to English if no locale is provided

    if (!phoneNumber) {
      throw new HttpsError("invalid-argument", "Phone number is required.");
    }

    const client = twilio(accountSid.value(), authToken.value());

    try {
      const verification = await client.verify.v2
        .services(SERVICE_SID)
        .verifications.create({
          channel: "sms",
          to: phoneNumber,
          locale,
        });

      return {
        status: verification.status,
        errorCode: null,
        error: null,
      };
    } catch (error: any) {
      const twilioMsg = error?.message;

      return {
        status: null,
        errorCode: error?.code || null,
        error: twilioMsg || "Failed to send verification code.",
      };
    }
  }
);

const createVerificationCheck = onCall(
  { secrets: [accountSid, authToken] },
  async (request) => {
    const { phoneNumber, code } = request.data;
    const uid = request.auth?.uid;

    if (!uid || !phoneNumber || !code) {
      return {
        status: null,
        errorCode: null,
        error: "Missing required parameters.",
      };
    }

    const client = twilio(accountSid.value(), authToken.value());

    try {
      const verificationCheck = await client.verify.v2
        .services(SERVICE_SID)
        .verificationChecks.create({
          code,
          to: phoneNumber,
        });

      if (verificationCheck.status !== "approved") {
        return {
          status: verificationCheck.status,
          errorCode: null,
          error: "Wrong verification code, please try again.",
        };
      }

      const db = getFirestore();
      await db.doc(`users/${uid}`).update({
        phoneNumber,
        phoneVerifiedAt: Timestamp.now(),
      });

      return {
        status: verificationCheck.status,
        errorCode: null,
        error: null,
      };
    } catch (error: any) {
      console.error("Twilio error:", error);

      return {
        status: null,
        errorCode: error?.code || null,
        error: error?.message || "Verification failed.",
      };
    }
  }
);

export { createVerification, createVerificationCheck };
