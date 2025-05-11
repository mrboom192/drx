import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

async function getUserById(uid: string) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default getUserById;
