import { onCall, HttpsError } from "firebase-functions/v2/https";
import { admin } from "../lib/admin";
import { Activity } from "../types/Activity";

const deleteUser = onCall(async (request) => {
  const { uid } = request.data as { uid?: string };

  if (!uid) {
    throw new HttpsError("invalid-argument", "Missing uid");
  }

  try {
    const userRef = admin.firestore().doc(`users/${uid}`);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new HttpsError("not-found", `User ${uid} not found`);
    }

    const userData = userSnap.data()!;
    const isPatient = userData.role === "patient";
    const isDoctor = userData.role === "doctor";

    const globalRef = admin.firestore().doc("admin/globals");

    const newActivity: Activity = {
      uid,
      type: "accountDeletion",
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      email: userData.email,
      timestamp: admin.firestore.Timestamp.now(), // ⚠️ use Timestamp.now(), not serverTimestamp() inside arrays
    };

    // Update counters + activity in transaction
    await admin.firestore().runTransaction(async (tx) => {
      const globalSnap = await tx.get(globalRef);
      const globalData = globalSnap.data() || {};
      const activities = (globalData.activity || []) as Activity[];

      const updatedActivities = [newActivity, ...activities].slice(0, 50);

      const updates: any = {
        numUsers: admin.firestore.FieldValue.increment(-1),
        activity: updatedActivities,
      };

      if (isPatient) {
        updates.numPatients = admin.firestore.FieldValue.increment(-1);
      } else if (isDoctor) {
        updates.numDoctors = admin.firestore.FieldValue.increment(-1);
      }

      tx.update(globalRef, updates);
    });

    // Clean up Firestore docs
    const batch = admin.firestore().batch();
    batch.delete(userRef);
    batch.delete(admin.firestore().doc(`pendingVerifications/${uid}`));
    batch.delete(admin.firestore().doc(`records/${uid}`));
    await batch.commit();

    // Delete Auth user
    await admin.auth().deleteUser(uid);

    return { success: true, message: `User ${uid} deleted successfully.` };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new HttpsError("internal", error.message || "Failed to delete user");
  }
});

export { deleteUser };
