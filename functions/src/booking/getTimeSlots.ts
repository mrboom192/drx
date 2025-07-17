import { endOfDay, startOfDay } from "date-fns";
import { admin } from "../lib/admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { datetime, RRule } from "rrule";
import { fromZonedTime } from "date-fns-tz";

type Time = {
  hour: number;
  minute: number;
};

type TimeSlot = {
  start: Time;
  end: Time;
};

type GetTimeSlotsPayload = {
  dates: string[]; // Array of date strings in ISO-8601 format
  duration: number; // Duration of each slot in minutes
  timezone: string; // Timezone of the doctor
};

const getTimeSlots = onCall(async (request): Promise<GetTimeSlotsPayload> => {
  const { doctorId, date } = request.data;

  if (!doctorId || !date) {
    throw new HttpsError("invalid-argument", "Missing doctorId or date.");
  }

  const requestedDate = new Date(date);
  const doctorData = await getDoctorPublicProfile(doctorId);
  // If we just leave it as is, the timeslots may be wrong.
  // If the user is in Oklahoma requesting timeslots at 9:00pm local time, the UTC date that comes in will be 2:00am the next day UTC time.
  // So we would actually be getting the wrong day.
  const dayOfWeek = requestedDate.getDay();

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

  // Result returns dates in UTC time which are based off of the doctor's timezone
  const potentialDates = doctorData.availability[dayOfWeek]?.flatMap(
    (timeSlot: any) =>
      getDatesFromTimeSlot({
        date: requestedDate,
        timeSlot,
        tzid: doctorData.timezone,
        interval: doctorData.consultationDuration,
      })
  );

  if (!potentialDates || potentialDates.length === 0) {
    return { dates: [], duration: 0, timezone: "UTC" };
  }

  const appointments = await getAppointmentsByDoctorAndDate(
    doctorId,
    requestedDate
  );

  // Filter out time slots that overlap with existing appointments
  const nonOverlappingDates = potentialDates.filter((date: Date) => {
    const slotStart = date.getTime();
    const slotEnd = slotStart + doctorData.consultationDuration * 60000;

    return !appointments.some((appointment) => {
      const appointmentStart = appointment.date.toDate().getTime();
      const appointmentEnd = appointmentStart + appointment.duration * 60000;
      return slotStart < appointmentEnd && slotEnd > appointmentStart;
    });
  });

  // Filter out time slots that are past the current time
  const now = new Date();
  const bookableDates = nonOverlappingDates.filter((date: Date) => {
    return date.getTime() > now.getTime();
  });

  return {
    dates: bookableDates.map((date: Date) => date.toISOString()),
    duration: doctorData.consultationDuration, // Duration is the same for all slots
    timezone: doctorData.timezone,
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

// Returns the dates in UTC time based on the doctor's timezone (the UTC date aligns with the doctor's local time)
export const getDatesFromTimeSlot = ({
  date,
  timeSlot,
  tzid,
  interval, // Consultation duration
}: {
  date: Date;
  timeSlot: TimeSlot;
  tzid: string; // Timezone of the doctor
  interval: number; // in minutes
}): Date[] => {
  // Extract year, month, and day from the requested date
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // RRULE uses 1-based months
  const day = date.getUTCDate();

  // Construct dtstart
  const dtstart = datetime(
    year,
    month,
    day,
    timeSlot.start.hour,
    timeSlot.start.minute
  );
  const until = datetime(
    year,
    month,
    day,
    timeSlot.end.hour,
    timeSlot.end.minute
  );

  const schedule = new RRule({
    freq: RRule.MINUTELY,
    dtstart,
    tzid,
    until,
    interval,
  })
    .all()
    .map((date) => {
      // Even though the given offset is `Z` (UTC), these dates are already
      // converted to our system time (from the doctor's timezone to ours)
      // So we'll treat them as local dates
      const localDate = date.toISOString().replace(/Z$/, "");
      const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // If we pass in the raw date, date-fns will interpret the 'Z' as
      // UTC time, not local time.
      const utcDate = fromZonedTime(localDate, serverTimezone);

      return utcDate;
    });

  return schedule;
};
