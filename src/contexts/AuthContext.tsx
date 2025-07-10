import { auth, database, functions } from "@/../firebaseConfig";
import {
  getAndRegisterPushToken,
  unregisterPushToken,
} from "@/api/notifications";
import { isOfflineForDatabase } from "@/constants/Presence";
import { useStopRecordsListener } from "@/stores/useRecordStore";
import { useStopUserListener } from "@/stores/useUserStore";
import { SignupUser } from "@/types/user";
import { RelativePathString, router } from "expo-router";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, set } from "firebase/database";
import { createContext, useContext, type PropsWithChildren } from "react";
import { useStorageState } from "../hooks/useStorageState";
import { httpsCallable } from "@firebase/functions";
import { useSetDisclaimer } from "@/stores/useDisclaimerStore";

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
  const setDisclaimer = useSetDisclaimer();
  const stopUserListener = useStopUserListener();
  const stopRecordsListener = useStopRecordsListener();

  async function signUp(email: string, password: string, data: SignupUser) {
    try {
      const createUser = httpsCallable<
        { email: string; password: string; data: SignupUser },
        | { uid: string } // success shape
        | { success: false; code: string; message: string } // error shape
      >(functions, "createUser");

      const result = await createUser({
        email,
        password,
        data,
      });

      if (!result.data || !("uid" in result.data)) {
        throw new Error("User creation failed. Please try again later.", {
          cause: "user-creation-failed",
        });
      }

      setDisclaimer(
        "A verification email has been sent to your email address. Please verify your email before logging in."
      );
      router.dismissTo("/login" as RelativePathString);
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

      // Prevent log in if the user is not verified
      if (!user.emailVerified) {
        // Sign out the user immediately if they are not verified
        await signOut(auth);

        throw new Error("Please verify your email before signing in.", {
          cause: "email-not-verified",
        });
      }

      // Save the user UID or token to session state
      await getAndRegisterPushToken();
      setSession(user.uid); // Or user.email or user.getIdToken() for token
      router.replace("/" as RelativePathString); // Lets go home!!!
    } catch (error: any) {
      throw error;
    }
  }

  async function signOutUser() {
    if (!auth.currentUser) {
      console.warn("Cannot log out if no user is logged in.");
      return;
    }

    try {
      // Set the user's status to offline in the database
      await set(
        ref(database, `/status/${auth.currentUser.uid}`),
        isOfflineForDatabase
      );
      await unregisterPushToken();
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
