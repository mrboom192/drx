import { parse } from "date-fns";

type Schedule = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  dayOfWeek: number; // 0-6 for Sunday-Saturday
};

// Since its much easier to work with the existing js date object, we'll use it to represent recurring schedules starting from 1st Jan 1970 (Thursday)
export const testUtils = () => {
  const time = "11:50 PM Monday";

  console.log(parse(time, "hh:mm a EEEE", new Date()));
};
