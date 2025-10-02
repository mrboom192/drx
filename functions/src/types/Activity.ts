export type Activity = {
  uid: string;
  type: "userSignup" | "accountDeletion" | "doctorVerification" | "other"; // Extendable for future activity types
  firstName: string;
  lastName: string;
  role: "patient" | "doctor";
  email: string;
  timestamp: FirebaseFirestore.FieldValue;
};
