import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { format, isBefore, formatDistanceToNowStrict } from "date-fns";
import { Appointment } from "@/types/appointment";

/**
 * Fetch the current / next appointment for the given patient and doctor.
 * Returns `null` if nothing is found.
 */
export async function getFirstRelevantAppointment(
  patientId: string,
  doctorId: string
): Promise<Appointment | null> {
  if (!patientId || !doctorId)
    throw new Error("Patient and Doctor IDs are required");

  // include appointments that started up to 24 h ago
  const twentyFourHoursAgo = Timestamp.fromMillis(
    Date.now() - 24 * 60 * 60 * 1000
  );

  const appointmentsRef = collection(db, "appointments");

  // Query: patientId == ..., doctorId == ..., date >= now-24h
  const q = query(
    appointmentsRef,
    where("patientId", "==", patientId),
    where("doctorId", "==", doctorId),
    where("date", ">=", twentyFourHoursAgo),
    orderBy("date", "asc"),
    limit(1)
  );

  try {
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as Appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
}

/**
 * Returns a simplified appointment status message and whether the appointment is ongoing.
 * Appointment window:
 * - Opens 20 minutes before the appointment
 * - Closes 24 hours after the appointment
 */
export async function fetchAppointmentStatus(
  patientId: string,
  doctorId: string
): Promise<{ message: string; ongoing: boolean }> {
  const appt = await getFirstRelevantAppointment(patientId, doctorId);

  if (!appt) {
    return {
      message:
        "You don't have any upcoming appointments. Please book another one to continue chatting or calling.",
      ongoing: false,
    };
  }

  const start = (appt.date as Timestamp).toDate();
  const now = new Date();

  const windowOpensAt = new Date(start.getTime() - 20 * 60 * 1000); // 20 min before
  const windowClosesAt = new Date(start.getTime() + 24 * 60 * 60 * 1000); // 24h after

  if (isBefore(now, windowOpensAt)) {
    return {
      message: `Your appointment window opens on ${format(
        windowOpensAt,
        "MMMM d 'at' h:mm a"
      )}.`,
      ongoing: false,
    };
  }

  if (isBefore(now, windowClosesAt)) {
    return {
      message: `Your appointment window closes in ${formatDistanceToNowStrict(
        windowClosesAt,
        { addSuffix: false }
      )}.`,
      ongoing: true,
    };
  }

  return {
    message:
      "You don't have any upcoming appointments. Please book another one to continue chatting or calling.",
    ongoing: false,
  };
}
