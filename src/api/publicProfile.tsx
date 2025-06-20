import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export const fetchPublicProfile = async () => {
  if (!auth.currentUser) return null;

  try {
    const docRef = doc(db, "publicProfiles", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching public profile:", error.message);
    return null;
  }
};
