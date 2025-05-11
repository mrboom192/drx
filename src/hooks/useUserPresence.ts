// hooks/useUserPresence.ts
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConfig";

export const useUserPresence = (uid: string | undefined | null) => {
  const [presence, setPresence] = useState<"online" | "offline" | null>(null);

  useEffect(() => {
    if (!uid) return;

    const statusRef = ref(database, `/status/${uid}`);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      setPresence(status?.state ?? null);
      console.log("User presence status:", status?.state);
    });

    return () => unsubscribe();
  }, [uid]);

  return presence;
};
