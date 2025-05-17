import { Timestamp } from "firebase/firestore";

export interface Notification {
  _id: string;
  userId: string;
  createdAt: Timestamp;
  message: string;
  title: string;
  importance: "low" | "medium" | "high";
  read: boolean;
  expireOn?: Timestamp;
}
