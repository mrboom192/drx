import { Timestamp } from "firebase/firestore";
import { User } from "./user";

export interface Appointment {
  id: string;
  date: Timestamp;
  time: string;
  createdAt: Timestamp;
  doctor: Pick<User, "firstName" | "lastName">;
  patient: Pick<User, "firstName" | "lastName" | "image">;
  patientId: string;
  doctorId: string;
  scheduledFor: Timestamp;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;

  timeSlot: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    id: string;
  };
}
