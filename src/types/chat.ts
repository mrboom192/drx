import { User } from "./user";

export interface Chat {
  id: string;
  doctor: Pick<User, "firstName" | "lastName" | "image">;
  patient: Pick<User, "firstName" | "lastName" | "image">;
  patient_id: string;
  doctor_id: string;
  created_at: number;
  last_message: string;
  last_sender_name: string;
  last_updated: number;

  patient_is_online: boolean;
  doctor_is_online: boolean;
}
