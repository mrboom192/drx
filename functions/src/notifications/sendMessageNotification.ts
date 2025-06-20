import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import axios from "axios";

export const sendMessageNotification = onDocumentCreated(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    const messageData = event.data?.data();

    if (!messageData) {
      console.error("No message data found.");
      return;
    }

    const { senderId, receiverId } = messageData;
    if (!senderId || !receiverId) {
      console.error("Missing senderId or receiverId.");
      return;
    }

    const receiverSnap = await admin
      .firestore()
      .collection("users")
      .doc(receiverId)
      .get();
    if (!receiverSnap.exists) {
      console.error("Receiver not found:", receiverId);
      return;
    }

    const receiverData = receiverSnap.data();
    const tokens: string[] = receiverData?.expoPushTokens || [];
    if (tokens.length === 0) {
      console.log("No push tokens for receiver.");
      return;
    }

    const senderSnap = await admin
      .firestore()
      .collection("users")
      .doc(senderId)
      .get();
    const senderData = senderSnap.exists ? senderSnap.data() : {};
    const senderName =
      receiverData?.role === "doctor"
        ? `Patient: ${senderData?.firstName || "Unknown"} ${
            senderData?.lastName || "Unknown"
          }`
        : `Dr. ${senderData?.lastName || "Unknown"}`;

    const messages = tokens.map((token) => ({
      to: token,
      sound: "default",
      title: senderName,
      body: "sent you a message • 💬",
      data: {
        type: "message",
        senderId,
        chatId: event.params.chatId,
      },
    }));

    try {
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
            .doc(receiverId)
            .update({
              expoPushTokens: admin.firestore.FieldValue.arrayRemove(ticket.to),
            });
        }
      }
    } catch (error) {
      console.error("Error sending message notification:", error);
    }
  }
);
