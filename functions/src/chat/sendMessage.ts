import { onCall, HttpsError } from "firebase-functions/v2/https";
import { admin } from "../lib/admin";
import { nanoid } from "nanoid";

type Request = {
  chatId: string;
  text: string;
};

export const sendMessage = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated.");
    }

    const senderId = request.auth.uid;
    const { chatId, text } = request.data as Request;

    const sanitizedMessage = text?.trim();
    if (!chatId || !sanitizedMessage) {
      throw new HttpsError(
        "invalid-argument",
        "Missing chatId or empty message."
      );
    }

    const chatRef = admin.firestore().collection("chats").doc(chatId);
    const chatDoc = await chatRef.get();

    const chatData = chatDoc.data();
    if (!chatDoc.exists || !chatData) {
      throw new HttpsError("not-found", "Chat not found.");
    }

    if (!chatData.users.includes(senderId)) {
      throw new HttpsError(
        "permission-denied",
        "User is not part of this chat."
      );
    }

    const receiverId = chatData.users.find((id: string) => id !== senderId);
    const createdAt = admin.firestore.Timestamp.now();
    const messageId = nanoid();

    const newMessage = {
      id: messageId,
      text: sanitizedMessage,
      senderId,
      receiverId,
      createdAt,
    };

    const messageRef = chatRef.collection("messages").doc(messageId);

    const batch = admin.firestore().batch();
    batch.set(messageRef, newMessage);
    batch.update(chatRef, {
      lastMessage: {
        text: sanitizedMessage,
        senderId,
        receiverId,
        timestamp: createdAt,
      },
      updatedAt: createdAt,
    });

    await batch.commit();

    return { success: true, message: newMessage };
  } catch (error: any) {
    console.error("Error sending message:", error);
    throw new HttpsError("internal", "Failed to send message.");
  }
});
