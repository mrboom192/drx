import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from "@firebase/firestore";
import { create } from "zustand";
import { auth, db } from "../../firebaseConfig";

type Case = {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  attachments: string[];
};

interface CaseStoreState {
  cases: Case[];
  isFetchingCases: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  startCasesListener: () => Promise<void>;
  stopCasesListener: () => void;
}

const useChatStore = create<CaseStoreState>((set, get) => ({
  // States
  cases: [],
  isFetchingCases: false,
  error: null,
  unsubscribe: null,

  // Actions
  startCasesListener: async () => {
    if (get().unsubscribe) return; // Prevent multiple listeners

    set({ isFetchingCases: true, error: null });

    try {
      const casesRef = collection(db, "secondOpinions");
      const casesQuery = query(
        casesRef,
        where("uid", "==", auth.currentUser?.uid)
      );

      const unsub = onSnapshot(
        casesQuery,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const fetchedCases = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Case[];

          set({
            cases: fetchedCases,
            isFetchingCases: false,
          });
        },
        (error) => {
          console.error("Error fetching cases:", error);
          set({ error: error.message, isFetchingCases: false });
        }
      );

      set({ unsubscribe: unsub });
    } catch (error: any) {
      set({ error: error.message, isFetchingCases: false });
    }
  },
  stopCasesListener: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub();
      set({ unsubscribe: null, cases: [] });
    }
  },
}));

// Selectors
export const useCases = () => useChatStore((state) => state.cases);

export const useCaseById = (id: string) =>
  useChatStore((state) => state.cases.find((caseItem) => caseItem.id === id));

export const useIsFetchingCases = () =>
  useChatStore((state) => state.isFetchingCases);

export const useCasesError = () => useChatStore((state) => state.error);

export const useStartCasesListener = () =>
  useChatStore((state) => state.startCasesListener);

export const useStopCasesListener = () =>
  useChatStore((state) => state.stopCasesListener);
