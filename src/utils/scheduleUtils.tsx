import { parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { datetime, RRule, RRuleSet, rrulestr } from "rrule";

type Schedule = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  dayOfWeek: number; // 0-6 for Sunday-Saturday
};

const rule = new RRule({
  freq: RRule.MINUTELY,
  interval: 5, // consultation duration
  dtstart: datetime(2012, 2, 1, 10, 30),
  until: datetime(2012, 12, 31),
});
// Result is in UTC time

//getScheduleFromRRule(new Date().toISOString());

export const getScheduleFromRRule = (requestedDate: string) => {
  // Get these from publicProfile
  const doctorTimezone = "America/Chicago"; // Example timezone
  const hourStart = 13; // Example hour 13 = 1pm
  const hourEnd = 19; // Example end hour 19 = 7pm

  const minuteStart = 30; // Example minute
  const minuteEnd = 0; // Example end minute

  const duration = 15; // Example consultation duration

  // Extract year, month, and day from the requested date
  const requestDate = new Date(requestedDate);
  const year = requestDate.getUTCFullYear();
  const month = requestDate.getUTCMonth() + 1; // RRULE uses 1-based months
  const day = requestDate.getUTCDate();

  // Construct dtstart
  const dtstart = datetime(year, month, day, hourStart, minuteStart);
  const until = datetime(year, month, day, hourEnd, minuteEnd);

  const schedule = new RRule({
    freq: RRule.MINUTELY,
    dtstart: dtstart,
    tzid: doctorTimezone,
    until: until,
    interval: duration,
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

  return { schedule };
};

// 384
// 192
// 75

// (405) 694-0170
// (405)

// 160
