import { auth, database, db } from "@/../firebaseConfig";
import { createMedicalRecord } from "@/api/medicalRecords";
import { isOfflineForDatabase } from "@/constants/Presence";
import { useStopRecordsListener } from "@/stores/useRecordStore";
import { useStopUserListener } from "@/stores/useUserStore";
import { SignupUser, User } from "@/types/user";
import { RelativePathString, router } from "expo-router";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, type PropsWithChildren } from "react";
import { useStorageState } from "../hooks/useStorageState";

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: SignupUser) => Promise<void>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const stopUserListener = useStopUserListener();
  const stopRecordsListener = useStopRecordsListener();

  async function signUp(email: string, password: string, data: SignupUser) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userData = {
        email: user.email,
        uid: user.uid,
        createdAt: serverTimestamp(),
        ...data,
      } as SignupUser & Pick<User, "uid" | "email" | "createdAt">;

      // Store user information in Firestore, merging user-specific data
      await setDoc(doc(db, "users", user.uid), userData);

      setSession(user.uid); // Save the new user ID or token to the session

      if (userData.role === "patient") {
        await createMedicalRecord(userData); // Create a medical record for the new user if they are a patient
      }

      router.replace("/" as RelativePathString); // Navigate to home page
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Registration failed: " + err.message);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save the user UID or token to session state
      setSession(user.uid); // Or user.email or user.getIdToken() for token
      router.replace("/" as RelativePathString); // Lets go home!!!
    } catch (error) {
      console.error("Error signing in:", error);
      throw error; // Re-throw to handle errors in the UI
    }
  }

  async function signOutUser() {
    try {
      // Set the user's status to offline in the database
      await set(
        ref(database, `/status/${auth.currentUser?.uid}`),
        isOfflineForDatabase
      );
      stopUserListener(); // Stop the user listener
      stopRecordsListener(); // Stop the records listener (if any)
      await signOut(auth);
      setSession(null); // Clear the session
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signIn, signUp, signOut: signOutUser, session, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
