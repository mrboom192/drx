import { Timestamp } from "firebase/firestore";
import { User } from "./user";

export interface Appointment {
  id: string;
  date: Timestamp;
  durationMinutes: number;
  createdAt: Timestamp;
  doctor: Pick<User, "firstName" | "lastName">;
  patient: Pick<User, "firstName" | "lastName" | "image">;
  patientId: string;
  doctorId: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
}
