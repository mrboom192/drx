import { Timestamp, WriteBatch } from "firebase-admin/firestore";
import { admin } from "../lib/admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { defineSecret } from "firebase-functions/params";
import sgMail from "@sendgrid/mail";
import { Activity } from "../types/Activity";
import axios from "axios";

export interface User {
  uid: string;
  dateOfBirth: Timestamp | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "patient" | "doctor";
  image: string;
  gender: string | null;

  createdAt: Timestamp;
  hasPublicProfile?: boolean;
  licenseImage?: string;
  expoPushTokens?: string[];
}

export type SignupUser = Pick<User, "firstName" | "lastName" | "role">;

const sgApiKey = defineSecret("SENDGRID_API_KEY");

const createUser = onCall({ secrets: [sgApiKey] }, async (request) => {
  const { email, password, data } = request.data;

  if (!email || !password || !data) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  try {
    const userRecord = await admin.auth().createUser({ email, password });

    const userData = {
      email: userRecord.email,
      uid: userRecord.uid,
      createdAt: Timestamp.now(),
      ...data,
    } as SignupUser & Pick<User, "uid" | "email" | "createdAt">;

    const isPatient = userData.role === "patient";
    const isDoctor = userData.role === "doctor";

    // Batch: user + optional record
    const batch = admin.firestore().batch();
    const userRef = admin.firestore().doc(`users/${userRecord.uid}`);
    batch.set(userRef, userData);

    if (isPatient) {
      await createMedicalRecord(batch, userData);
    }

    // Globals: transaction
    const globalRef = admin.firestore().doc("admin/globals");
    const newActivity: Activity = {
      uid: userRecord.uid,
      type: "userSignup",
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      email: userRecord.email!,
      timestamp: Timestamp.now(),
    };

    await admin.firestore().runTransaction(async (tx) => {
      const globalSnap = await tx.get(globalRef);
      const globalData = globalSnap.data() || {};
      const activities = (globalData.activity || []) as Activity[];

      const updatedActivities = [newActivity, ...activities].slice(0, 50);

      const updates: any = {
        numUsers: admin.firestore.FieldValue.increment(1),
        numUsersAllTime: admin.firestore.FieldValue.increment(1),
        activity: updatedActivities,
      };

      if (isPatient)
        updates.numPatients = admin.firestore.FieldValue.increment(1);
      if (isDoctor)
        updates.numDoctors = admin.firestore.FieldValue.increment(1);

      tx.update(globalRef, updates);
    });

    await batch.commit();

    // Verification email
    await sendNotificationToAdmins();
    const link = await getAuth().generateEmailVerificationLink(email);
    await sendCustomVerificationEmail(email, link, sgApiKey.value());

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new HttpsError("internal", error.message || "User creation failed");
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
    gender: null,
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
    dynamicTemplateData: { verificationLink: link },
  };

  sgMail.setApiKey(apiKey);
  await sgMail.send(email);
};

/**
 * Sends a broadcast notification to all admin devices.
 * Looks up tokens from Firestore: admin/globals.adminExpoPushTokens
 */
export const sendNotificationToAdmins = async (): Promise<void> => {
  try {
    const globalsRef = admin.firestore().doc("admin/globals");
    const globalsSnap = await globalsRef.get();
    const data = globalsSnap.data();

    if (
      !data ||
      !Array.isArray(data.adminExpoPushTokens) ||
      data.adminExpoPushTokens.length === 0
    ) {
      console.log("No admin Expo push tokens found in admin/globals.");
      return;
    }

    const tokens: string[] = data.adminExpoPushTokens;

    const title = "DrX Admin";
    const body = "A new user has signed up!";
    const dataPayload = {
      type: "admin_alert",
      timestamp: Date.now(),
    };

    // 3️⃣ Build the messages payload for Expo
    const messages = tokens.map((token) => ({
      to: token,
      sound: "default",
      title,
      body,
      data: dataPayload,
      priority: "high",
    }));

    // 4️⃣ Send to Expo push service
    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      messages,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Handle invalid tokens
    const tickets = response.data?.data ?? [];
    for (const ticket of tickets) {
      if (
        ticket.status === "error" &&
        ticket.details?.error === "DeviceNotRegistered"
      ) {
        await globalsRef.update({
          adminExpoPushTokens: admin.firestore.FieldValue.arrayRemove(
            ticket.to
          ),
        });
        console.log(`Removed unregistered token: ${ticket.to}`);
      }
    }

    console.log(`Sent admin notification to ${tokens.length} devices.`);
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
};
