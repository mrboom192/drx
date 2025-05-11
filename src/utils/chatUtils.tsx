import { Chat } from "@/types/chat";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export function subscribeToUserById(
  uid: string,
  callback: (user: any | null) => void
) {
  const userRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error subscribing to user:", error);
      callback(null);
    }
  );

  return unsubscribe; // call this to stop listening
}

export const getSenderName = (uid: string, chat: Chat): string => {
  if (uid === "system") return "System";

  if (chat.participants.doctor.uid === uid) {
    return `${chat.participants.doctor.firstName} ${chat.participants.doctor.lastName}`;
  }

  if (chat.participants.patient.uid === uid) {
    return `${chat.participants.patient.firstName} ${chat.participants.patient.lastName}`;
  }

  return "Unknown";
};

export const getSenderAvatar = (uid: string, chat: Chat): string => {
  if (uid === "system") return ""; // or a default system icon

  const { doctor, patient } = chat.participants;

  if (doctor.uid === uid) return doctor.image || "";
  if (patient.uid === uid) return patient.image || "";

  return "";
};
