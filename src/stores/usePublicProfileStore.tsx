import { doc, onSnapshot } from "@firebase/firestore";
import { create } from "zustand";
import { auth, db } from "../../firebaseConfig";

interface PublicProfileStoreState {
  publicProfile: any;
  isFetchingPublicProfile: boolean;
  error: string | null;
  fetchPublicProfile: () => Promise<void>;
}

const usePublicProfileStore = create<PublicProfileStoreState>((set, get) => ({
  publicProfile: null,
  isFetchingPublicProfile: false,
  error: null,

  // Actions
  fetchPublicProfile: async () => {
    set({ isFetchingPublicProfile: true, error: null });

    if (!auth.currentUser) {
      set({ error: "User not authenticated", isFetchingPublicProfile: false });
      return;
    }

    try {
      const docRef = doc(db, "publicProfiles", auth.currentUser.uid);
      onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            set({
              publicProfile: { id: docSnap.id, ...docSnap.data() },
              isFetchingPublicProfile: false,
            });
          } else {
            set({
              publicProfile: null,
              isFetchingPublicProfile: false,
              error: "Public profile not found",
            });
          }
        },
        (error) => {
          console.error("Error fetching public profile:", error);
          set({ error: error.message, isFetchingPublicProfile: false });
        }
      );
    } catch (error: any) {
      set({ error: error.message, isFetchingPublicProfile: false });
    }
  },
}));

// Selectors
export const usePublicProfile = () =>
  usePublicProfileStore((state) => state.publicProfile);

export const useIsFetchingPublicProfile = () =>
  usePublicProfileStore((state) => state.isFetchingPublicProfile);

export const usePublicProfileError = () =>
  usePublicProfileStore((state) => state.error);

export const useFetchPublicProfile = () =>
  usePublicProfileStore((state) => state.fetchPublicProfile);
