import { Timestamp } from "firebase/firestore";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export interface User {
  uid: string;
  dateOfBirth: Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  image: string;
  gender: string;

  // Doctor-specific fields
  createdAt: Timestamp;
  hasPublicProfile?: boolean;
  licenseImage?: string;
  verification?: VerificationStatus;

  // For notifications
  expoPushTokens?: string[];
}

export type SignupUser = Pick<User, "firstName" | "lastName" | "role">;
