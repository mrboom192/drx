import { create } from "zustand";

export interface FilterState {
  providerLanguage: string;
  priceRange: [number, number];
  specialty: string;
}

interface FilterStoreState {
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStoreState>((set) => ({
  filters: {
    providerLanguage: "en",
    priceRange: [0, 100],
    specialty: "all",
  },
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
        providerLanguage: "en",
        priceRange: [0, 100],
        specialty: "all",
      },
    }),
}));

// Selectors
export const useFilters = () => useFilterStore((state) => state.filters);
export const useSetFilters = () => useFilterStore((state) => state.setFilters);
export const useResetFilters = () =>
  useFilterStore((state) => state.resetFilters);
