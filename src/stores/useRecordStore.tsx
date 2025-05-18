import { MedicalRecord } from "@/types/medicalRecord";
import { doc, onSnapshot } from "@firebase/firestore";
import { create } from "zustand";
import { auth, db } from "../../firebaseConfig";

interface RecordStoreState {
  medicalRecord: MedicalRecord | null;
  isFetchingRecords: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  startRecordsListener: () => Promise<void>;
  stopRecordsListener: () => void;
}

const useRecordStore = create<RecordStoreState>((set, get) => ({
  medicalRecord: null,
  isFetchingRecords: false,
  error: null,
  unsubscribe: null,

  // Actions
  startRecordsListener: async () => {
    if (get().unsubscribe) return; // Prevent multiple listeners

    set({ isFetchingRecords: true, error: null });

    try {
      const unsub = onSnapshot(
        doc(db, "records", auth.currentUser!.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            set({
              medicalRecord: {
                id: docSnap.id,
                ...docSnap.data(),
              } as MedicalRecord,
              isFetchingRecords: false,
            });
          } else {
            set({
              medicalRecord: null,
              isFetchingRecords: false,
              error: "Record not found",
            });
          }
        },
        (error) => {
          console.error("Error fetching record:", error);
          set({ error: error.message, isFetchingRecords: false });
        }
      );

      set({ unsubscribe: unsub });
    } catch (error: any) {
      set({ error: error.message, isFetchingRecords: false });
    }
  },
  stopRecordsListener: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub();
      set({ unsubscribe: null, medicalRecord: null });
    }
  },
}));

// Selectors
export const useMedicalRecord = () =>
  useRecordStore((state) => state.medicalRecord);

export const useIsFetchingMedicalRecords = () =>
  useRecordStore((state) => state.isFetchingRecords);

export const useRecordsError = () => useRecordStore((state) => state.error);

export const useStartRecordsListener = () =>
  useRecordStore((state) => state.startRecordsListener);

export const useStopRecordsListener = () =>
  useRecordStore((state) => state.stopRecordsListener);

// Returns allergies
export const useRecordStoreAllergies = () =>
  useRecordStore((state) => state.medicalRecord?.allergies);

// Returns allergy given an id
export const useRecordStoreAllergyById = (id: string) =>
  useRecordStore((state) =>
    state.medicalRecord?.allergies.find((allergy) => allergy.id === id)
  );

// Returns medications
export const useRecordStoreMedications = () =>
  useRecordStore((state) => state.medicalRecord?.medications);

// Returns medication given an id
export const useRecordStoreMedicationById = (id: string) =>
  useRecordStore((state) =>
    state.medicalRecord?.medications.find((medication) => medication.id === id)
  );
