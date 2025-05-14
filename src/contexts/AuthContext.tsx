import { auth, database, db } from "@/../firebaseConfig";
import { isOfflineForDatabase } from "@/constants/Presence";
import { useStopUserListener } from "@/stores/useUserStore";
import { RelativePathString, router } from "expo-router";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { doc, setDoc } from "firebase/firestore";
import { createContext, useContext, type PropsWithChildren } from "react";
import { useStorageState } from "../hooks/useStorageState";

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: object) => Promise<void>;
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

  async function signUp(email: string, password: string, data: object) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user information in Firestore, merging user-specific data
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        ...data, // Spread additional user information
      });

      setSession(user.uid); // Save the new user ID or token to the session
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
