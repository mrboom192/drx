import { onValueWritten } from "firebase-functions/v2/database";
import { getAuth } from "firebase-admin/auth";

const forceQue = onValueWritten("/force/{uid}", async (event) => {
  const snapshot = event.data;

  // Exit if the data was deleted
  if (!snapshot.after.exists()) {
    return;
  }

  const uid = event.params.uid;

  try {
    await getAuth().updateUser(uid, { emailVerified: true });
    console.log(`Email verified for user: ${uid}`);
  } catch (error) {
    console.error(`Error verifying email for user ${uid}:`, error);
  }
});

export { forceQue };
