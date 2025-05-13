import { Appointment } from "@/types/appointment";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QuerySnapshot,
  Timestamp,
  where,
} from "@firebase/firestore";
import { addDays, parseISO, startOfDay } from "date-fns";
import { useMemo } from "react";
import { create } from "zustand";
import { db } from "../../firebaseConfig";

interface AppointmentStoreState {
  appointments: Appointment[];
  isFetchingAppointments: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  clearAppointments: () => void;
  startAppointmentsListener: (doctorId: string) => Promise<void>;
  stopAppointmentsListener: () => void;
}

const useAppointmentStoreState = create<AppointmentStoreState>((set, get) => ({
  // States
  appointments: [],
  isFetchingAppointments: false,
  error: null,
  unsubscribe: null,

  // Actions
  clearAppointments: () => set({ appointments: [] }),
  startAppointmentsListener: async (doctorId: string) => {
    if (get().unsubscribe) return;

    set({ isFetchingAppointments: true, error: null });

    try {
      const appointmentsRef = collection(db, "appointments");
      const appointmentsQuery = query(
        appointmentsRef,
        where("doctorId", "==", doctorId)
      );

      const unsub = onSnapshot(
        appointmentsQuery,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const fetchedAppointments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Appointment[];

          set({
            appointments: fetchedAppointments,
            isFetchingAppointments: false,
          });
        },
        (error) => {
          console.error("Error fetching appointments:", error);
          set({ error: error.message, isFetchingAppointments: false });
        }
      );

      set({ unsubscribe: unsub });
    } catch (error: any) {
      set({ error: error.message, isFetchingAppointments: false });
    }
  },
  stopAppointmentsListener: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub();
      set({ unsubscribe: null, appointments: [] }); // optional: clear state
    }
  },
}));

// Selectors
export const useAppointments = () =>
  useAppointmentStoreState((state) => state.appointments);

export const useIsFetchingAppointments = () =>
  useAppointmentStoreState((state) => state.isFetchingAppointments);

export const useAppointmentError = () =>
  useAppointmentStoreState((state) => state.error);

export const useStartAppointmentsListener = () =>
  useAppointmentStoreState((state) => state.startAppointmentsListener);

export const useStopAppointmentsListener = () =>
  useAppointmentStoreState((state) => state.stopAppointmentsListener);

export const useClearAppointments = () =>
  useAppointmentStoreState((state) => state.clearAppointments);

export const useAppointmentsByDate = (date: string) => {
  const appointments = useAppointmentStoreState((state) => state.appointments);

  return useMemo(() => {
    const selectedDate = parseISO(date);
    const start = Timestamp.fromDate(startOfDay(selectedDate));
    const end = Timestamp.fromDate(startOfDay(addDays(selectedDate, 1)));

    return appointments.filter((appointment) => {
      return (
        appointment.date.toMillis() >= start.toMillis() &&
        appointment.date.toMillis() < end.toMillis()
      );
    });
  }, [appointments, date]);
};
