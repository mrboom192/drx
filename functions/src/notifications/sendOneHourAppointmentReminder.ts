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
        const doctorId = data.doctorId;

        if (!appointmentDate || !patientId || !doctorId) {
          logger.warn(`Missing data in appointment ${doc.id}`);
          continue;
        }

        const [patientSnap, doctorSnap] = await Promise.all([
          admin.firestore().collection("users").doc(patientId).get(),
          admin.firestore().collection("users").doc(doctorId).get(),
        ]);

        const patientData = patientSnap.data();
        const doctorData = doctorSnap.data();
        const patientTokens: string[] = patientData?.expoPushTokens || [];
        const doctorTokens: string[] = doctorData?.expoPushTokens || [];

        if (patientTokens.length === 0 && doctorTokens.length === 0) {
          logger.warn(
            `No Expo tokens for patient ${patientId} or doctor ${doctorId}`
          );
          continue;
        }

        const diffInMinutes = Math.round(
          (appointmentDate.getTime() - now.toMillis()) / 60000
        );

        const timePhrase =
          diffInMinutes >= 55 && diffInMinutes <= 65
            ? "in about an hour"
            : `in ${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`;

        const patientMessages = patientTokens.map((token) => ({
          to: token,
          sound: "default",
          title: "Appointment Reminder",
          body: `You have an appointment ${timePhrase} with Dr. ${data.doctor.firstName} ${data.doctor.lastName}.`,
          data: {
            type: "appointment-reminder",
            appointmentId: doc.id,
          },
        }));

        const doctorMessages = doctorTokens.map((token) => ({
          to: token,
          sound: "default",
          title: "Upcoming Appointment",
          body: `You have an appointment ${timePhrase} with your patient ${patientData?.firstName} ${data.doctor.lastName}.`,
          data: {
            type: "appointment-reminder",
            appointmentId: doc.id,
          },
        }));

        const allMessages = [...patientMessages, ...doctorMessages];

        try {
          const response = await axios.post(
            "https://exp.host/--/api/v2/push/send",
            allMessages,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          for (const ticket of response.data.data) {
            if (
              ticket.status === "error" &&
              ticket.details?.error === "DeviceNotRegistered"
            ) {
              const userIdToUpdate = patientTokens.includes(ticket.to)
                ? patientId
                : doctorId;

              await admin
                .firestore()
                .collection("users")
                .doc(userIdToUpdate)
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
