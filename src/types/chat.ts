import { Timestamp } from "firebase/firestore";
import { User } from "./user";

export interface Chat {
  id: string;
  users: string[];

  participants: {
    doctor: Pick<User, "uid" | "firstName" | "lastName" | "image">;
    patient: Pick<User, "uid" | "firstName" | "lastName" | "image">;
  };

  lastMessage: {
    text: string;
    senderId: string;
    timestamp: number; // Firestore timestamps can be converted to number or use Firebase Timestamp type
  };

  hasActiveCall: boolean;
  status: "ongoing" | "finished" | "pending";
  createdAt: Timestamp; // Use camelCase for consistency
  updatedAt: Timestamp;

  patient_is_online?: boolean;
  doctor_is_online?: boolean;
}
