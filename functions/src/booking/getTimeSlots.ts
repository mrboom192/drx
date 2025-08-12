import {
  eachDayOfInterval,
  endOfDay,
  startOfDay,
  addMinutes,
  isWithinInterval,
  areIntervalsOverlapping,
} from "date-fns";
import { admin } from "../lib/admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { TZDate } from "@date-fns/tz";

type Time = {
  hour: number;
  minute: number;
};

type Availability = {
  start: Time;
  end: Time;
};

type GetTimeSlotsPayload = {
  dates: string[]; // Array of date strings in ISO-8601 format
  duration: number; // Duration of each slot in minutes
  timeZone: string; // Timezone of the doctor
};

const getTimeSlots = onCall(async (request): Promise<GetTimeSlotsPayload> => {
  const { doctorId, date, timeZone } = request.data;

  if (!doctorId || !date || !timeZone) {
    throw new HttpsError(
      "invalid-argument",
      "Missing doctorId, date or timezone."
    );
  }

  const doctorData = await getDoctorPublicProfile(doctorId);
  const now = new TZDate(Date.now(), timeZone);
  const selectedDate = new TZDate(date, timeZone);
  const start = startOfDay(selectedDate);
  const end = endOfDay(selectedDate);

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

  const dayDates = eachDayOfInterval({
    start: start.withTimeZone(doctorData.timeZone),
    end: end.withTimeZone(doctorData.timeZone),
  });
  let slots: TZDate[] = [];

  // Result returns dates in UTC time which are based off of the doctor's timezone
  dayDates.forEach((day) => {
    const availabilitySlots = doctorData.availability[day.getDay()];
    if (!availabilitySlots) return;

    const potentialDates = availabilitySlots.flatMap(
      (availability: Availability) =>
        generateTimeSlots(
          day,
          availability,
          doctorData.timeZone,
          doctorData.consultationDuration
        ).filter((potentialDate) =>
          isWithinInterval(potentialDate, {
            start: now > start ? now : start,
            end: end,
          })
        )
    );

    slots.push(...potentialDates);
  });

  if (!slots || slots.length === 0) {
    return {
      dates: [],
      duration: doctorData.consultationDuration,
      timeZone: doctorData.timeZone,
    };
  }

  const appointments = await getAppointmentsByDoctorAndDate(doctorId, start);

  // Filter out time slots that overlap with existing appointments
  const nonOverlappingDates = slots.filter((date) => {
    const slotStart = date;
    const slotEnd = addMinutes(date, doctorData.consultationDuration);

    return !appointments.some((appointment) => {
      const appointmentStart = new TZDate(
        appointment.date.toDate(),
        doctorData.timeZone
      );
      const appointmentEnd = addMinutes(appointmentStart, appointment.duration);
      return areIntervalsOverlapping(
        { start: slotStart, end: slotEnd },
        { start: appointmentStart, end: appointmentEnd }
      );
    });
  });

  return {
    dates: nonOverlappingDates.map((date: TZDate) => date.toISOString()),
    duration: doctorData.consultationDuration, // Duration is the same for all slots
    timeZone: doctorData.timeZone,
  };
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

const generateTimeSlots = (
  date: TZDate,
  availability: Availability,
  doctorTimeZone: string,
  duration: number
) => {
  const slots: Date[] = [];

  const doctorAvailabilityStart = new TZDate(date, doctorTimeZone);
  doctorAvailabilityStart.setDate(date.getDate());
  doctorAvailabilityStart.setHours(
    availability.start.hour,
    availability.start.minute,
    0,
    0
  );

  const doctorAvailabilityEnd = new TZDate(date, doctorTimeZone);
  doctorAvailabilityEnd.setDate(date.getDate());
  doctorAvailabilityEnd.setHours(
    availability.end.hour,
    availability.end.minute,
    0,
    0
  );

  let current = new TZDate(doctorAvailabilityStart);

  while (current < doctorAvailabilityEnd) {
    slots.push(new TZDate(current, doctorTimeZone));
    current = addMinutes(current, duration);
  }

  return slots;
};
