import { endOfDay, parseISO, startOfDay } from "date-fns";
import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { TimeSlot } from "@/types/timeSlot";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const getTimeSlots = async (
  doctorId: string,
  date: string
): Promise<TimeSlot[]> => {
  if (!doctorId || !date) {
    throw new Error("Missing parameters");
  }

  const requestedDate = new Date(date);
  const doctorData = await getDoctorPublicProfile(doctorId);
  const dayOfWeek = DAYS[requestedDate.getDay()];

  const timeSlots = doctorData.availability[dayOfWeek]?.flatMap(
    (interval: any) =>
      getTimeSlotOptions({
        date: requestedDate,
        start: interval.start,
        end: interval.end,
        duration: doctorData.consultationDuration,
      })
  );

  if (!timeSlots || timeSlots.length === 0) {
    return [];
  }

  const appointments = await getAppointmentsByDoctorAndDate(
    doctorId,
    requestedDate
  );

  // Filter out time slots that overlap with existing appointments
  const filteredTimeSlots = timeSlots.filter((slot: TimeSlot) => {
    const slotStart = slot.date.getTime();
    const slotEnd = slotStart + slot.duration * 60000;

    return !appointments.some((appointment) => {
      const appointmentStart = appointment.date.toDate().getTime();
      const appointmentEnd = appointmentStart + appointment.duration * 60000;
      return slotStart < appointmentEnd && slotEnd > appointmentStart;
    });
  });

  return filteredTimeSlots;
};

export { getTimeSlots };

const getAppointmentsByDoctorAndDate = async (
  doctorId: string,
  date: Date
): Promise<any[]> => {
  if (!doctorId || !date) {
    throw new Error("Doctor ID and date are required");
  }

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const appointmentsRef = collection(db, "appointments");
  const appointmentsQuery = query(
    appointmentsRef,
    where("doctorId", "==", doctorId),
    where("date", ">=", Timestamp.fromDate(dayStart)),
    where("date", "<=", Timestamp.fromDate(dayEnd))
  );

  const snapshot = await getDocs(appointmentsQuery);
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const getDoctorPublicProfile = async (doctorId: string) => {
  if (!doctorId) {
    throw new Error("Doctor ID is required");
  }

  const doctorRef = doc(db, "publicProfiles", doctorId);
  const doctorDoc = await getDoc(doctorRef);

  if (!doctorDoc.exists()) {
    throw new Error("Doctor not found");
  }

  return doctorDoc.data();
};

const getTimeSlotOptions = ({
  date,
  start,
  end,
  duration,
}: {
  date: Date;
  start: string; // "HH:mm"
  end: string;
  duration: number; // in minutes
}): TimeSlot[] => {
  if (!date || !start || !end || !duration) {
    throw new Error("Missing parameters for building time slots");
  }

  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  const startTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startHours,
    startMinutes
  );
  const endTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    endHours,
    endMinutes
  );

  const slots: TimeSlot[] = [];
  const now = new Date();

  for (
    let time = new Date(startTime);
    time < endTime;
    time.setMinutes(time.getMinutes() + duration)
  ) {
    const slotEnd = time.getTime() + duration * 60000;

    if (slotEnd <= endTime.getTime() && time >= now) {
      slots.push({
        date: new Date(time), // clone to avoid mutation
        duration,
      });
    }
  }

  return slots; // Returns { date: Date, duration: number }[]
};
