import { onCall, HttpsError } from "firebase-functions/v2/https";
import { admin } from "../lib/admin";
import axios from "axios";

export const sendCallNotification = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated.");
    }

    const { calleeId, callId, lastName } = request.data;

    if (!calleeId || !lastName) {
      throw new HttpsError("invalid-argument", "Missing calleeId or lastName.");
    }

    const calleeSnap = await admin
      .firestore()
      .collection("users")
      .doc(calleeId)
      .get();

    if (!calleeSnap.exists) {
      throw new HttpsError("not-found", "Callee not found.");
    }

    const calleeData = calleeSnap.data();
    const tokens: string[] = calleeData?.expoPushTokens || [];

    if (tokens.length === 0) {
      throw new HttpsError("not-found", "No Expo push tokens for the callee.");
    }

    const messages = tokens.map((token) => ({
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

    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      messages,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

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

    return { success: true };
  } catch (error: any) {
    console.error("Error sending call notification:", error);
    throw new HttpsError("internal", "Failed to send call notification.");
  }
});
