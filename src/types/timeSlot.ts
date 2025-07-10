import { Timestamp } from "firebase/firestore";

export interface Appointment {
  createdAt: Timestamp;
  startTime: Timestamp;
  doctorUid: string; // Unique identifier for the doctor
  patientUid: string; // Unique identifier for the patient
  status: "ongoing" | "pending" | "finished"; // Status of the appointment
}

// For doctors, this is the time they are available
export interface Availability {
  uid: string; // Doctor's unique identifier
  weeklyAvailability: {
    [day: string]: string[]; // Array of start times for each day
  };
  exceptions?: {
    [date: string]: string[];
  };
}

export type TimeSlot = {
  date: string;
  duration: number;
};

// For patients, this is the time they can book
// Get timeslots for a specific day string[]; get from Availability.weeklyAvailability.day
// Then get booked appointments for that day Appointment[]; indexed by startTime
// Finally, return available, filtered timeslots string[]
