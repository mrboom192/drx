import { endOfDay, startOfDay } from "date-fns";
import { admin } from "../lib/admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

type TimeSlot = {
  date: Date;
  duration: number;
};

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const getTimeSlots = onCall(async (request): Promise<TimeSlot[]> => {
  const { doctorId, date } = request.data;

  if (!doctorId || !date) {
    throw new HttpsError("invalid-argument", "Missing doctorId or date.");
  }

  const requestedDate = new Date(date);
  const doctorData = await getDoctorPublicProfile(doctorId);
  const dayOfWeek = DAYS[requestedDate.getDay()];

  if (
    !doctorData ||
    !doctorData.availability ||
    !doctorData.consultationDuration
  ) {
    throw new HttpsError(
      "not-found",
      "Doctor not found or missing availability data."
    );
  }

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

  return filteredTimeSlots.map((slot: TimeSlot) => ({
    date: slot.date.toISOString(), // Convert to string
    duration: slot.duration,
  }));
});

export { getTimeSlots };

const getAppointmentsByDoctorAndDate = async (
  doctorId: string,
  date: Date
): Promise<any[]> => {
  if (!doctorId || !date) {
    throw new HttpsError("invalid-argument", "Missing doctorId or date.");
  }

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const appointmentsRef = admin.firestore().collection("appointments");
  const appointmentsQuery = appointmentsRef
    .where("doctorId", "==", doctorId)
    .where("date", ">=", admin.firestore.Timestamp.fromDate(dayStart))
    .where("date", "<=", admin.firestore.Timestamp.fromDate(dayEnd));

  const snapshot = await appointmentsQuery.get();
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const getDoctorPublicProfile = async (doctorId: string) => {
  if (!doctorId) {
    throw new HttpsError("invalid-argument", "Missing doctorId.");
  }

  const doctorRef = admin
    .firestore()
    .collection("publicProfiles")
    .doc(doctorId);
  const doctorDoc = await doctorRef.get();

  if (!doctorDoc.exists) {
    throw new HttpsError("not-found", "Doctor not found.");
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
    throw new HttpsError(
      "invalid-argument",
      "Missing date, start time, end time, or duration."
    );
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
    time <= endTime;
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
