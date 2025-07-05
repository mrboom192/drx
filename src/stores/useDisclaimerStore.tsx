// src/stores/useMessageStore.ts
import { create } from "zustand";

interface DisclaimerStoreState {
  message: string | null;
  setMessage: (msg: string) => void;
  clearMessage: () => void;
}

export const useDisclaimerStore = create<DisclaimerStoreState>()((set) => ({
  message: null,
  setMessage: (msg) => set({ message: msg }),
  clearMessage: () => set({ message: null }),
}));

// Selectors
export const useDisclaimer = () => useDisclaimerStore((state) => state.message);

export const useSetDisclaimer = () =>
  useDisclaimerStore((state) => state.setMessage);

export const useClearDisclaimer = () =>
  useDisclaimerStore((state) => state.clearMessage);
