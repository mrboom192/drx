import { create } from "zustand";

export interface FilterState {
  providerLanguages?: string[];
  priceRange?: [number, number];
  specialty?: string;
  services?: string[];
}

interface FilterStoreState {
  filters: FilterState;
  clearAndSetFilters: (filters: FilterState) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStoreState>((set) => ({
  filters: {
    providerLanguages: [],
    priceRange: [0, 100],
    specialty: "all",
    services: [],
  },
  clearAndSetFilters: (filters) => set({ filters }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    })),
  resetFilters: () =>
    set({
      filters: {
        providerLanguages: [],
        priceRange: [0, 100],
        specialty: "all",
        services: [],
      },
    }),
}));

// Selectors
export const useFilters = () => useFilterStore((state) => state.filters);
export const useClearAndSetFilters = () =>
  useFilterStore((state) => state.clearAndSetFilters);
export const useSetFilters = () => useFilterStore((state) => state.setFilters);
export const useResetFilters = () =>
  useFilterStore((state) => state.resetFilters);
