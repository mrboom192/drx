import { collection, getDocs, limit, query } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../firebaseConfig";

interface DoctorStoreState {
  doctors: any[];
  isFetchingDoctors: boolean;
  error: string | null;

  fetchSomeDoctors: () => Promise<void>;
}

const useDoctorStore = create<DoctorStoreState>((set, get) => ({
  doctors: [],
  isFetchingDoctors: false,
  error: null,

  // Actions
  fetchSomeDoctors: async () => {
    set({ isFetchingDoctors: true, error: null });

    try {
      const doctorsRef = collection(db, "publicProfiles");
      const q = query(doctorsRef, limit(25));
      const querySnapshot = await getDocs(q);

      const doctorsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({ doctors: doctorsList });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      set({ error: "Failed to load doctors. Please try again." });
    } finally {
      set({ isFetchingDoctors: false });
    }
  },
}));

// Selectors
export const useDoctors = () => useDoctorStore((state) => state.doctors);

export const useIsFetchingDoctors = () =>
  useDoctorStore((state) => state.isFetchingDoctors);

export const useDoctorsError = () => useDoctorStore((state) => state.error);

export const useFetchSomeDoctors = () =>
  useDoctorStore((state) => state.fetchSomeDoctors);

// Filtered doctors list
export const useFilteredDoctors = (specialty: string) => {
  const doctors = useDoctors();
  const normalizedSpecialty = specialty.toLowerCase();

  if (!specialty || normalizedSpecialty === "all") {
    return doctors;
  }

  const filteredDoctors = normalizedSpecialty
    ? doctors.filter((doctor) =>
        doctor.specializations.some(
          (spec: string) => spec.toLowerCase() === normalizedSpecialty
        )
      )
    : doctors;

  return filteredDoctors;
};

// Get a doctor by ID
export const useDoctorById = (doctorId: string) => {
  const doctors = useDoctors();
  return doctors.find((doctor) => doctor.id === doctorId) || null;
};
