import { TimeSlot } from "@/types/timeSlot";

export const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const interval = 30; // 30 minutes

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const startTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const endTime = `${hour.toString().padStart(2, "0")}:${(minute + interval)
        .toString()
        .padStart(2, "0")}`;
      slots.push({
        id: `${date.toISOString().split("T")[0]}-${startTime}-${endTime}`,
        startTime,
        endTime,
        isAvailable: true,
      });
    }
  }
  return slots;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};
