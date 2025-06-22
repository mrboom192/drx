export type TimeSlot = {
  start: string;
  end: string;
};

type Availability = {
  Sun: TimeSlot[];
  Mon: TimeSlot[];
  Tue: TimeSlot[];
  Wed: TimeSlot[];
  Thu: TimeSlot[];
  Fri: TimeSlot[];
  Sat: TimeSlot[];
};

export type PublicProfile = {
  specializations: string[];
  languages: string[];
  experience: string;
  biography: string;
  countries: string[];
  consultationPrice: string;
  secondOpinionPrice: string;
  weightLossPrice: string;
  radiologyPrice: string;
  services: string[];
  consultationDuration: string;
  availability: Availability;
  timeZone: string | null;
};
