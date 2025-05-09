import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  dateOfBirth: Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  image: string;

  // Doctor-specific fields
  hasPublicProfile?: boolean;
  licenseImage?: string;
  verification?: string;
}
