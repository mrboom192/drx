import { Timestamp, WriteBatch } from "firebase-admin/firestore";
import { admin } from "../lib/admin";
import { onCall } from "firebase-functions/https";
import { getAuth } from "firebase-admin/auth";
import { defineSecret } from "firebase-functions/params";
import sgMail from "@sendgrid/mail";

export interface User {
  uid: string;
  dateOfBirth: Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  image: string;
  gender: string;

  // Doctor-specific fields
  createdAt: Timestamp;
  hasPublicProfile?: boolean;
  licenseImage?: string;

  // For notifications
  expoPushTokens?: string[];
}

export type SignupUser = Pick<User, "firstName" | "lastName" | "role">;

const sgApiKey = defineSecret("SENDGRID_API_KEY");

const createUser = onCall({ secrets: [sgApiKey] }, async (request) => {
  const { email, password, data } = request.data;

  if (!email || !password || !data) {
    throw new Error("Missing required fields");
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const userData = {
      email: userRecord.email,
      uid: userRecord.uid,
      createdAt: Timestamp.now(),
      ...data,
    } as SignupUser & Pick<User, "uid" | "email" | "createdAt">;

    // Start Firestore batch
    const batch = admin.firestore().batch();

    // Add user doc to batch
    const userRef = admin.firestore().doc(`users/${userRecord.uid}`);
    batch.set(userRef, userData);

    // Conditionally add medical record to batch
    if (userData.role === "patient") {
      await createMedicalRecord(batch, userData); // Pass batch and userData
    }

    // Commit the batch
    await batch.commit();

    // Send verification email
    const link = await getAuth().generateEmailVerificationLink(email);
    await sendCustomVerificationEmail(email, link, sgApiKey.value());

    return { uid: userRecord.uid };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      success: false,
      code: error.code || "UNKNOWN_ERROR",
      message: error.message || "User creation failed",
    };
  }
});

export { createUser };

async function createMedicalRecord(
  batch: WriteBatch,
  user: SignupUser & Pick<User, "uid" | "email" | "createdAt">
) {
  const initialMedicalRecord = {
    patientId: user.uid,
    doctorIds: [],

    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: null,
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

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const recordRef = admin.firestore().doc(`records/${user.uid}`);
  batch.set(recordRef, initialMedicalRecord);
}

const sendCustomVerificationEmail = async (
  userEmail: string,
  link: string,
  apiKey: string
): Promise<void> => {
  const email = {
    to: userEmail,
    from: "wassim.radwan@drxonline.com",
    templateId: "d-0ebb4fb3981c486f9bf2f7ec8a664ba2",
    dynamicTemplateData: {
      verificationLink: link,
    },
  };

  sgMail.setApiKey(apiKey);
  await sgMail.send(email);
};
