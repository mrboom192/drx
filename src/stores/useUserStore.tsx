import { User } from "@/types/user";
import { doc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../firebaseConfig";

interface UserStoreState {
  userData: User | null;
  status: "idle" | "loading" | "error" | "authenticated";
  unsubscribe: (() => void) | null;
  startUserListener: (uid: string) => Promise<void>;
  stopUserListener: () => void;
}

const useUserStore = create<UserStoreState>((set, get) => ({
  // States
  userData: null,
  status: "idle",
  unsubscribe: null,

  // Actions
  startUserListener: async (uid: string) => {
    const current = get();
    if (current.unsubscribe && current.userData?.uid === uid) return;
    if (current.unsubscribe) current.unsubscribe();

    set({ status: "loading", userData: null });

    const userRef = doc(db, "users", uid);

    const unsubscribeSnapshot = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          set({
            userData: {
              uid: uid,
              ...(snapshot.data() as Omit<User, "uid">),
            },
            status: "authenticated",
          });
        } else {
          set({
            userData: null,
            status: "error",
          });
        }
      },
      (error) => {
        set({
          userData: null,
          status: "error",
          unsubscribe: null,
        });
        console.error("Error retrieving user information:", error);
      }
    );

    set({ unsubscribe: unsubscribeSnapshot });
  },
  stopUserListener: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub();
      set({ unsubscribe: null, status: "idle", userData: null });
    }
  },
}));

// Selectors
export const useUserData = () => useUserStore((state) => state.userData);

export const useIsUserLoggedIn = () =>
  useUserStore((state) => state.status === "authenticated");

export const useIsFetchingUser = () =>
  useUserStore((state) => state.status === "loading");

export const useUserError = () =>
  useUserStore((state) => state.status === "error");

export const useStartUserListener = () =>
  useUserStore((state) => state.startUserListener);

export const useStopUserListener = () =>
  useUserStore((state) => state.stopUserListener);
