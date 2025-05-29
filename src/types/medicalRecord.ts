import { Timestamp } from "firebase/firestore";

export type MedicalRecord = {
  id: string;

  // Patient information
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp | Date;
  gender: string;

  patientId: string;
  conditions: Condition[]; // e.g., diabetes, hypertension, etc.
  medications: Medication[];
  allergies: Allergy[];
  screenings: string[];
  vaccinations: string[];
  personalHistory: string[]; // e.g., alcohol use, smoking, etc.
  surgicalHistory: string[];
  womenHealth: string[]; // e.g., pregnancy history, menstrual history, etc.
  familyHistory: string[]; // e.g., family diseases, genetic conditions, etc.
  socialHistory: string[]; // e.g., occupation, living situation, etc.
  notes: string[]; // e.g., sexual health, exercise, etc.

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Condition = {
  id: string;
  name: string;
  description: string;
  comments?: string; // e.g., additional notes or observations

  status: "active" | "inactive" | "resolved";
  onsetDate: Timestamp | Date;
  resolutionDate?: Timestamp | Date;
  severity?: "mild" | "moderate" | "severe";
  complications?: string[]; // e.g., related conditions or complications
  treatment?: string; // e.g., treatment plan or medications
  notes?: string; // e.g., additional notes or observations
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  route: string;
  interval: string;
  frequency: string;
};

export type Allergy = {
  id: string;
  name: string;
  reaction: string;
};
