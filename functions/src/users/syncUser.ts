import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { admin } from "../lib/admin";

const syncUser = onDocumentUpdated("users/{userId}", async (event) => {
  const userId = event.params.userId;
  const newValue = event?.data?.after.data();
  const oldValue = event?.data?.before.data();

  if (!newValue || !userId) return;

  const { firstName, lastName, image, role } = newValue;

  // Exit early if no relevant changes
  const hasChanged =
    oldValue?.firstName !== firstName ||
    oldValue?.lastName !== lastName ||
    oldValue?.image !== image;

  if (!hasChanged) return;

  const db = admin.firestore();
  const updates = [];

  const roleField = role === "patient" ? "patientId" : "doctorId";
  const nestedPath = role === "patient" ? "patient" : "doctor";

  const appointmentsSnap = await db
    .collection("appointments")
    .where(roleField, "==", userId)
    .get();

  appointmentsSnap.forEach((doc) => {
    updates.push(
      doc.ref.update({
        [`${nestedPath}.firstName`]: firstName,
        [`${nestedPath}.lastName`]: lastName,
        [`${nestedPath}.image`]: image,
      })
    );
  });

  // --- Update chats ---
  const chatsSnap = await db
    .collection("chats")
    .where("users", "array-contains", userId)
    .get();

  chatsSnap.forEach((doc) => {
    updates.push(
      doc.ref.update({
        [`participants.${nestedPath}.firstName`]: firstName,
        [`participants.${nestedPath}.lastName`]: lastName,
        [`participants.${nestedPath}.image`]: image,
      })
    );
  });

  // --- Update public profile if doctor ---
  if (role === "doctor") {
    updates.push(
      db.collection("publicProfiles").doc(userId).set(
        {
          firstName,
          lastName,
          image,
        },
        { merge: true }
      )
    );
  }

  // --- Update medical record if patient ---
  if (role === "patient") {
    updates.push(
      db.collection("records").doc(userId).set(
        {
          firstName,
          lastName,
        },
        { merge: true }
      )
    );
  }

  await Promise.all(updates);
});

export { syncUser };
