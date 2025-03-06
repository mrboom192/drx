export interface User {
  name: string;
  role: string;
  profileImage: string;
  gender: string;
  age: number;
  weight: Measurement;
  height: Measurement;
}

interface Measurement {
  value: number;
  unit: string;
}
