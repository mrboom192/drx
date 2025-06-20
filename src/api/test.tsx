import { nanoid } from "nanoid";
import {
  doc,
  getDoc,
  serverTimestamp,
  arrayUnion,
  collection,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export async function createTestAppointment({
  doctorId,
  timeSlotStr,
}: {
  doctorId: string;
  timeSlotStr: string;
}) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const patientId = currentUser.uid;

  try {
    const doctorRef = doc(db, "publicProfiles", doctorId);
    const patientRef = doc(db, "users", patientId);

    const [doctorSnap, patientSnap] = await Promise.all([
      getDoc(doctorRef),
      getDoc(patientRef),
    ]);

    if (!doctorSnap.exists() || !patientSnap.exists()) {
      throw new Error("Doctor or patient not found");
    }

    const doctor = doctorSnap.data();
    const patient = patientSnap.data();

    let timeSlot;
    try {
      timeSlot = JSON.parse(timeSlotStr);
    } catch {
      throw new Error("Invalid time slot JSON");
    }

    const appointmentRef = doc(collection(db, "appointments"));
    const chatId = [doctorId, patientId].sort().join("_");
    const chatRef = doc(db, "chats", chatId);
    const messageId = nanoid();
    const messageRef = doc(collection(chatRef, "messages"), messageId);
    const recordRef = doc(db, "records", patientId);

    const batch = writeBatch(db);

    // Create appointment
    batch.set(appointmentRef, {
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
      timeSlot,
      date: Timestamp.now(),
      price: doctor.consultationPrice,
      status: "confirmed",
      createdAt: Timestamp.now(),
    });

    // Ensure chat exists
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
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
          text: "New consultation created",
          senderId: "system",
          timestamp: serverTimestamp(),
        },
        status: "ongoing",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Add system message
    batch.set(messageRef, {
      id: messageId,
      text: "New consultation created",
      senderId: "system",
      createdAt: Timestamp.now(),
      system: true,
      sent: false,
      received: false,
      pending: true,
    });

    // Update patient's record
    batch.set(
      recordRef,
      {
        doctorIds: arrayUnion(doctorId),
      },
      { merge: true }
    );

    await batch.commit();
    console.log("✅ Test appointment and chat created.");
  } catch (err) {
    console.error(
      "❌ Error creating test appointment:",
      err instanceof Error ? err.stack : err
    );
    throw err;
  }
}
