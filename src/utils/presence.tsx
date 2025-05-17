import {
  isOfflineForDatabase,
  isOnlineForDatabase,
} from "@/constants/Presence";
import { onDisconnect, onValue, ref, set } from "firebase/database";
import { database } from "../../firebaseConfig";

export const initUserPresence = (uid: string) => {
  const userStatusRef = ref(database, `/status/${uid}`);

  // A special path in the Realtime Database that is updated when the user's
  // client is connected (or disconnected!)
  const connectedRef = ref(database, ".info/connected");

  const unsubscribe = onValue(connectedRef, (snap) => {
    // Return if we are not connected
    if (snap.val() === false) return;

    // When we disconnect (e.g., close app, reload, lose network),
    // the server will mark us offline.
    onDisconnect(userStatusRef)
      .set(isOfflineForDatabase)
      .then(() => {
        // Add a short delay before setting us online to help
        // reduce false "offline" flickers during reloads or something
        setTimeout(() => {
          set(userStatusRef, isOnlineForDatabase);
        }, 100); // 100ms debounce buffer
      })
      .catch(console.error);
  });

  return unsubscribe;
};
