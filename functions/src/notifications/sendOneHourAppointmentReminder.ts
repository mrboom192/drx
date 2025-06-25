import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import { admin } from "../lib/admin";
import axios from "axios";

export const sendOneHourAppointmentReminder = onSchedule(
  { schedule: "every 5 minutes", timeZone: "America/Chicago" },
  async () => {
    const now = admin.firestore.Timestamp.now();
    const oneHourFromNow = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + 60 * 60 * 1000
    );

    try {
      const snapshot = await admin
        .firestore()
        .collection("appointments")
        .where("date", ">=", now)
        .where("date", "<=", oneHourFromNow)
        .where("hasSentReminder", "==", false)
        .get();

      if (snapshot.empty) {
        logger.log("No upcoming appointments to notify.");
        return;
      }

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const appointmentDate = data.date?.toDate?.();
        const patientId = data.patientId;

        if (!appointmentDate || !patientId) {
          logger.warn(`Missing date or patientId in ${doc.id}`);
          continue;
        }

        // Get patient's Expo tokens
        const patientSnap = await admin
          .firestore()
          .collection("users")
          .doc(patientId)
          .get();
        const patientData = patientSnap.data();
        const tokens: string[] = patientData?.expoPushTokens || [];

        if (tokens.length === 0) {
          console.warn(`No Expo tokens for patient ${patientId}`);
          continue; // Skip if the user has no devices we can send notifications to
        }

        const diffInMinutes = Math.round(
          (appointmentDate.getTime() - now.toMillis()) / 60000
        );

        const timePhrase =
          diffInMinutes >= 55 && diffInMinutes <= 65
            ? "in about an hour"
            : `in ${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`;

        const messages = tokens.map((token) => ({
          to: token,
          sound: "default",
          title: "Appointment Reminder",
          body: `You have an appointment ${timePhrase} with Dr. ${data.doctor.firstName} ${data.doctor.lastName}.`,
          data: {
            type: "appointment-reminder",
            appointmentId: doc.id,
          },
        }));

        try {
          const response = await axios.post(
            "https://exp.host/--/api/v2/push/send",
            messages,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          // If any tickets have errors, remove the token from Firestore since that means the device is no longer registered
          for (const ticket of response.data.data) {
            if (
              ticket.status === "error" &&
              ticket.details?.error === "DeviceNotRegistered"
            ) {
              await admin
                .firestore()
                .collection("users")
                .doc(patientId)
                .update({
                  expoPushTokens: admin.firestore.FieldValue.arrayRemove(
                    ticket.to
                  ),
                });
            }
          }

          await doc.ref.update({ hasSentReminder: true });
          logger.log(`Reminder sent for appointment ${doc.id}`);
        } catch (err) {
          logger.error(`Failed to send notification for ${doc.id}:`, err);
        }
      }
    } catch (err) {
      logger.error("Failed to process appointment reminders:", err);
    }
  }
);
