import { get, ref } from "firebase/database";
import { database } from "../../firebaseConfig";

/**
 * Checks if a user is currently online based on their presence status in the database.
 *
 * @param {string} uid - The UID of the user to check.
 * @returns {Promise<'online' | 'offline' | null>} - The user's status, or null if not found.
 */
export async function getUserPresenceStatus(uid: string) {
  try {
    const statusRef = ref(database, `/status/${uid}`);
    const snapshot = await get(statusRef);

    if (snapshot.exists()) {
      const { state } = snapshot.val();
      return state === "online" ? "online" : "offline";
    }

    return null; // No presence data exists yet
  } catch (error) {
    console.error("Error reading user presence status:", error);
    return null;
  }
}
