import { parse } from "date-fns";
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

// Since its much easier to work with the existing js date object, we'll use it to represent recurring schedules starting from 1st Jan 1970 (Thursday)
export const testUtils = () => {
  const time = "11:50 PM Monday";

  console.log(parse(time, "hh:mm a EEEE", new Date()));
  console.log(rule.toString());
};

// Result is in UTC time

//getScheduleFromRRule(new Date().toISOString());

export const getScheduleFromRRule = (requestedDate: string) => {
  // Get these from publicProfile
  const doctorTimezone = "America/Chicago"; // Example timezone
  const hourStart = 13; // Example hour
  const hourEnd = 19; // Example end hour

  const minuteStart = 30; // Example minute
  const minuteEnd = 0; // Example end minute

  const duration = 15; // Example consultation duration

  // Extract year, month, and day from the requested date
  const year = new Date(requestedDate).getUTCFullYear();
  const month = new Date(requestedDate).getUTCMonth() + 1; // Months are zero-based
  const day = new Date(requestedDate).getUTCDate();

  // Construct dtstart
  const dtstart = datetime(year, month, day, hourStart, minuteStart);
  const until = datetime(year, month, day, hourEnd, minuteEnd);

  const rule = new RRule({
    freq: RRule.MINUTELY,
    dtstart: dtstart,
    tzid: doctorTimezone,
    until: until,
    interval: duration,
  });

  return rule.all();
};

// 384
// 192
// 75

// (405) 694-0170
// (405)

// 160
