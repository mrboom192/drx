type TimeSlot = {
  time: Date;
  duration: number;
};

type Availability = {
  sunday: TimeSlot[];
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
};

export type PublicProfile = {
  image?: string;
  name?: string;
  firstName?: string;
  lastName?: string;

  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
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
