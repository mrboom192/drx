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
  availableDays: string[];
  consultationDuration: string;
};

type TimeSlot = {
  startTime: string;
  endTime: string;
  day: string;
};
