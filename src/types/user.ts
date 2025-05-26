import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  dateOfBirth: Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  image: string;
  gender: string;

  // Doctor-specific fields
  createdAt: Timestamp;
  hasPublicProfile?: boolean;
  licenseImage?: string;
  verification?: string;
}

export type SignupUser = Pick<
  User,
  "firstName" | "lastName" | "dateOfBirth" | "role"
>;
