import { SignupUser, User } from "@/types/user";
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from "@firebase/firestore";
import { db } from "../../firebaseConfig";

export async function createMedicalRecord(
  user: SignupUser & Pick<User, "uid" | "email" | "createdAt">
) {
  const initialMedicalRecord = {
    patientId: user.uid,
    doctorIds: [],

    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    gender: "",

    medications: [],
    allergies: [],
    screenings: [],
    vaccinations: [],
    personalHistory: [],
    surgicalHistory: [],
    womenHealth: [],
    familyHistory: [],
    socialHistory: [],
    notes: [],

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "records", user.uid), initialMedicalRecord);
}

export async function addMedication(
  userId: string,
  medication: { name: string; dosage: string; frequency: string }
) {
  const userRef = doc(db, "records", userId);
  await updateDoc(userRef, {
    medications: arrayUnion(medication),
    updatedAt: serverTimestamp(),
  });
}
