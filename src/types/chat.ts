export interface Chat {
  id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  doctor_profile_url: string;
  user_profile_url: string;
  created_at: number;
  last_message: string;
  last_sender_name: string;
  last_updated: number;
}
