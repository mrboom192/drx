export interface Doctor {
  id: string;
  profile_url: string;
  verified: boolean;
  name: string;
  specialty: string[];
  summary: string;
  description: string;
  experience_years: number;
  hospital_affiliation: string;
  hospital_address: string;
  hospital_coordinates: Hospitalcoordinates;
  education: string;
  languages_spoken: string[];
  accepts_insurance: boolean;
  rating: number;
  reviews: number;
  consultation_price: number;
  currency: string;
  phone: string;
  email: string;
  availability: Availability;
  photo_url: string;
}

interface Availability {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

interface Hospitalcoordinates {
  latitude: number;
  longitude: number;
}
