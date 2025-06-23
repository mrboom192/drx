"use strict";

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { log } from "firebase-functions/logger";
import { nanoid } from "nanoid";
import { admin } from "../lib/admin";
import { utcToZonedTime, format as formatTz } from "date-fns-tz";
import sgMail from "@sendgrid/mail";

import Stripe from "stripe";
import { firestore } from "firebase-admin";

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY_TEST");
const stripeSigningSecret = defineSecret("STRIPE_SIGNING_SECRET_TEST");
const sgApiKey = defineSecret("SENDGRID_API_KEY");

export const handleStripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeSigningSecret, sgApiKey], cors: true },
  async (req, res) => {
    if (!stripeSigningSecret) {
      console.error("Missing Stripe signing secret for environment");
      res.status(500).send("Server misconfiguration.");
      return;
    }

    const signature = req.headers["stripe-signature"];
    if (!signature) {
      res.status(400).send("Missing Stripe signature header.");
      return;
    }

    const stripe = new Stripe(stripeSecretKey.value());
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        stripeSigningSecret.value()
      );

      let paymentIntent = null;

      switch (event.type) {
        case "payment_intent.created":
          paymentIntent = event.data.object;
          log("Payment Intent Created", paymentIntent.id);
          break;

        case "payment_intent.succeeded":
          paymentIntent = event.data.object;
          log("Payment Intent Succeeded", paymentIntent.id);
          await handleSuccessfulBooking(paymentIntent, res);
          return;

        case "payment_intent.canceled":
          paymentIntent = event.data.object;
          log("Payment Intent Cancelled", paymentIntent.id);
          break;

        default:
          log("Unhandled event type", event.type);
          break;
      }

      res.send();
    } catch (error) {
      res.status(400).send(`Error constructing Stripe event: ${error}`);
    }
  }
);

async function handleSuccessfulBooking(paymentIntent: any, res: any) {
  const metadata = paymentIntent.metadata;
  const patientId = metadata?.patientId;
  const doctorId = metadata?.doctorId;
  const date = metadata?.date;
  const timeZone = metadata?.timeZone;

  if (!patientId || !doctorId || !date || !timeZone) {
    console.warn("Missing metadata fields for appointment creation");
    res.status(400).send("Missing required metadata");
    return;
  }

  try {
    const [doctorSnap, patientSnap] = await Promise.all([
      admin.firestore().collection("publicProfiles").doc(doctorId).get(),
      admin.firestore().collection("users").doc(patientId).get(),
    ]);

    if (!doctorSnap.exists || !patientSnap.exists) {
      console.error("Doctor or patient does not exist");
      res.status(404).send("Doctor or patient not found");
      return;
    }

    const doctor = doctorSnap.data();
    const patient = patientSnap.data();
    const appointmentDate = new Date(date);

    if (!doctor || !patient) {
      console.error("Doctor or patient data is missing");
      res.status(404).send("Doctor or patient data not found");
      return;
    }

    const zonedDate = utcToZonedTime(appointmentDate, timeZone);

    const formattedDate = formatTz(zonedDate, "MMMM d, yyyy", { timeZone });
    const timeString = formatTz(zonedDate, "h:mm a zzz", { timeZone });
    const newAppointmentMessage = `New booked appointment for ${formattedDate} at ${timeString}.`;

    const batch = admin.firestore().batch();
    const appointmentRef = admin.firestore().collection("appointments").doc();

    const appointmentData = {
      doctorId,
      patientId,
      doctor: {
        firstName: doctor.firstName,
        lastName: doctor.lastName,
      },
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        image: patient.image || null,
      },
      date: firestore.Timestamp.fromDate(appointmentDate),
      durationMinutes: doctor.consultationDuration,
      price: doctor.consultationPrice,
      status: "confirmed",
      createdAt: admin.firestore.Timestamp.now(),
    };

    batch.set(appointmentRef, appointmentData);

    // Create or update chat
    const chatId = [doctorId, patientId].sort().join("_");
    const chatRef = admin.firestore().collection("chats").doc(chatId);
    const chatSnap = await chatRef.get();

    if (!chatSnap.exists) {
      batch.set(chatRef, {
        users: [patientId, doctorId],
        participants: {
          doctor: {
            uid: doctorId,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            image: doctor.image || null,
          },
          patient: {
            uid: patientId,
            firstName: patient.firstName,
            lastName: patient.lastName,
            image: patient.image || null,
          },
        },
        lastMessage: {
          text: newAppointmentMessage,
          senderId: "system",
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: "ongoing",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      batch.update(chatRef, {
        lastMessage: {
          text: newAppointmentMessage,
          senderId: "system",
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const messageId = nanoid();
    const messageRef = chatRef.collection("messages").doc(messageId);

    batch.set(messageRef, {
      id: messageId,
      text: newAppointmentMessage,
      senderId: "system",
      createdAt: admin.firestore.Timestamp.now(),
      system: true,
      sent: false,
      received: false,
      pending: true,
    });

    // Update doctor's patient list
    const patientMedicalRecordRef = admin
      .firestore()
      .collection("records")
      .doc(patientId);
    batch.set(
      patientMedicalRecordRef,
      { doctorIds: admin.firestore.FieldValue.arrayUnion(doctorId) },
      { merge: true }
    );

    // Send email
    sgMail.setApiKey(sgApiKey.value());
    const msg = {
      to: patient.email,
      from: "wassim.radwan@drxonline.com",
      templateId: "d-5852114f367e4ed3a78c95e6fcab9746", // Replace with real SendGrid template ID
      dynamicTemplateData: {
        patientFirst: patient.firstName,
        doctorFirst: doctor.firstName,
        doctorLast: doctor.lastName,
        date: formattedDate,
        time: timeString,
        duration: doctor.consultationDuration,
      },
    };

    await batch.commit();
    await sgMail.send(msg);

    log("Appointment and chat successfully created");
    res.status(200).send("Appointment created");
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).send("Internal server error");
  }
}
