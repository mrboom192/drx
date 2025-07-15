import { getTimezoneOffset } from "date-fns-tz";
import { addMilliseconds, format } from "date-fns";

const offsetAvailabilityTimes = (timeZone: string, availability: any) => {
  const now = new Date(); // Any base date is fine; we're only shifting time-of-day
  const offsetMs = getTimezoneOffset(timeZone, now); // Get offset in milliseconds

  const result: Record<string, { start: string; end: string }[]> = {};

  Object.keys(availability).forEach((day) => {
    result[day] = availability[day].map(
      (interval: { start: string; end: string }) => {
        const [startHours, startMinutes] = interval.start
          .split(":")
          .map(Number);
        const [endHours, endMinutes] = interval.end.split(":").map(Number);

        const baseDate = new Date(2000, 0, 1); // Arbitrary date
        const start = new Date(baseDate);
        start.setHours(startHours, startMinutes);

        const end = new Date(baseDate);
        end.setHours(endHours, endMinutes);

        const offsetStart = addMilliseconds(start, -offsetMs);
        const offsetEnd = addMilliseconds(end, -offsetMs);

        return {
          start: format(offsetStart, "HH:mm"),
          end: format(offsetEnd, "HH:mm"),
        };
      }
    );
  });

  return result;
};

export default offsetAvailabilityTimes;
