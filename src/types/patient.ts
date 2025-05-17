export interface Patient {
  id: string;

  // user info
  image: string; // link to user profile image
  firstName: string;
  lastName: string;

  // contact info
  phone: string;
  email: string;

  currency: string;

  // Stats
  consultationTime: number;
  numberOpinions: number;
  imagesReviewed: number;
  poundsLost: number;
  icuTime: number;
}
