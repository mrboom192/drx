import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { admin } from "../lib/admin";
import { logger } from "firebase-functions";
import Stripe from "stripe";
import { defineSecret } from "firebase-functions/params";

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");

export const cleanupUserData = onDocumentDeleted(
  { document: "users/{userId}", secrets: [stripeSecretKey] },
  async (event) => {
    const userId = event.params.userId;
    logger.info(`🚮 Starting cleanup for user: ${userId}`);

    const stripe = new Stripe(stripeSecretKey.value());

    const batch = admin.firestore().batch();

    try {
      // Try deleting the Firebase Auth user
      try {
        await admin.auth().deleteUser(userId);
        logger.info(`✅ Deleted Firebase Auth user: ${userId}`);
      } catch (err: any) {
        if (err.code === "auth/user-not-found") {
          logger.info(`ℹ️ Auth user ${userId} already deleted`);
        } else {
          logger.error(`❌ Error deleting Auth user:`, err);
        }
      }

      // Clean up chats
      const chatsSnap = await admin
        .firestore()
        .collection("chats")
        .where("users", "array-contains", userId)
        .get();
      chatsSnap.forEach((chat) => {
        batch.delete(chat.ref);
        logger.info(`🗑️ Deleted chat ${chat.id}`);
      });

      // Clean up appointments
      const apptSnap = await admin
        .firestore()
        .collection("appointments")
        .where("patientId", "==", userId)
        .get();
      apptSnap.forEach((doc) => {
        batch.delete(doc.ref);
        logger.info(`🗑️ Deleted appointment ${doc.id}`);
      });

      // Delete Stripe customer
      try {
        const stripeSnap = await admin
          .firestore()
          .collection("stripe_customers")
          .doc(userId)
          .get();
        if (stripeSnap.exists) {
          const customerId = stripeSnap.data()?.customer_id;
          if (customerId) {
            await stripe.customers.del(customerId);
            logger.info(`✅ Deleted Stripe customer ${customerId}`);
          }
          batch.delete(stripeSnap.ref);
        }
      } catch (err) {
        logger.error("❌ Stripe deletion error:", err);
      }

      // Public profile
      const profileSnap = await admin
        .firestore()
        .collection("publicProfiles")
        .doc(userId)
        .get();
      if (profileSnap.exists) {
        batch.delete(profileSnap.ref);
        logger.info(`🗑️ Deleted public profile`);
      }

      // Delete records
      const recordsSnap = await admin
        .firestore()
        .collection("records")
        .doc(userId)
        .get();

      if (recordsSnap.exists) {
        batch.delete(recordsSnap.ref);
      }

      // Pending verification
      const verifySnap = await admin
        .firestore()
        .collection("pendingVerifications")
        .doc(userId)
        .get();
      if (verifySnap.exists) {
        batch.delete(verifySnap.ref);
        logger.info(`🗑️ Deleted pending verification`);
      }

      // Final commit
      await batch.commit();
      logger.info(`✅ Cleanup complete for user: ${userId}`);
    } catch (err) {
      logger.error("❌ Cleanup process failed:", err);
    }
  }
);
