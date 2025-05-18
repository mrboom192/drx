import { MedicalRecord } from "@/types/medicalRecord";
import { SignupUser, User } from "@/types/user";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
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

export async function addItemToMedicalRecord<T extends Record<string, any>>(
  userId: string,
  field: "medications" | "allergies",
  item: T
) {
  const userRef = doc(db, "records", userId);
  await updateDoc(userRef, {
    [field]: arrayUnion(item),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteItemFromMedicalRecord(
  userId: string,
  medicalRecord: MedicalRecord,
  itemId: string,
  field: "medications" | "allergies"
) {
  const userRef = doc(db, "records", userId);

  const updatedItems = (medicalRecord?.[field] || []).filter(
    (item: any) => item.id !== itemId
  );

  await updateDoc(userRef, {
    [field]: updatedItems,
    updatedAt: serverTimestamp(),
  });
}

export async function updateItemInMedicalRecord<T extends { id: string }>(
  userId: string,
  medicalRecord: MedicalRecord,
  updatedItem: T,
  field: "medications" | "allergies"
) {
  const userRef = doc(db, "records", userId);

  const existingItems = medicalRecord?.[field] as unknown as T[];

  const updatedItems = existingItems.map((item) =>
    item.id === updatedItem.id ? updatedItem : item
  );

  await updateDoc(userRef, {
    [field]: updatedItems,
    updatedAt: serverTimestamp(),
  });
}
