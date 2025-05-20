import {
  collection,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
} from "@firebase/firestore";
import { BillingDetails } from "@stripe/stripe-react-native";
import { create } from "zustand";
import { auth, db } from "../../firebaseConfig";

interface BillingStoreState {
  billingDetails: BillingDetails[];
  isFetchingBillingDetails: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  startBillingDetailsListener: () => Promise<void>;
  stopBillingDetailsListener: () => void;
}

const useBillingStore = create<BillingStoreState>((set, get) => ({
  billingDetails: [],
  isFetchingBillingDetails: false,
  error: null,
  unsubscribe: null,

  startBillingDetailsListener: async () => {
    if (get().unsubscribe) return; // prevent multiple listeners

    const userId = auth.currentUser?.uid;
    if (!userId) {
      set({ error: "User not authenticated." });
      return;
    }

    set({ isFetchingBillingDetails: true, error: null });

    try {
      const billingRef = collection(
        db,
        "stripe_customers",
        userId,
        "billing_addresses"
      );

      const unsub = onSnapshot(
        billingRef,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const fetched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as BillingDetails[];

          set({
            billingDetails: fetched,
            isFetchingBillingDetails: false,
          });
        },
        (error) => {
          console.error("Error fetching billing addresses:", error);
          set({ error: error.message, isFetchingBillingDetails: false });
        }
      );

      set({ unsubscribe: unsub });
    } catch (error: any) {
      set({ error: error.message, isFetchingBillingDetails: false });
    }
  },

  stopBillingDetailsListener: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub();
      set({ unsubscribe: null, billingDetails: [] });
    }
  },
}));

export const useBillingAddresses = () =>
  useBillingStore((state) => state.billingDetails);

export const useIsFetchingBillingAddresses = () =>
  useBillingStore((state) => state.isFetchingBillingDetails);

export const useBillingError = () => useBillingStore((state) => state.error);

export const useStartBillingListener = () =>
  useBillingStore((state) => state.startBillingDetailsListener);

export const useStopBillingListener = () =>
  useBillingStore((state) => state.stopBillingDetailsListener);
