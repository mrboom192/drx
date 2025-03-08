import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

interface UserData {
  email: string;
  userType: string;
  gender: string;
  age: number;
  language: string;
}

const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure we have an authenticated user
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Reference to the user's document
    const userDocRef = doc(db, "users", user.uid);

    // Set up Firestore real-time listener
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data() as UserData);
      } else {
        console.warn("User document does not exist");
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { userData, loading };
};

export default useUserData;
