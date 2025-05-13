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
  startAppointmentsListener: (doctorId: string) => Promise<void>;
  stopAppointmentsListener: () => void;
}

const useAppointmentStore = create<AppointmentStoreState>((set, get) => ({
  // States
  appointments: [],
  isFetchingAppointments: false,
  error: null,
  unsubscribe: null,

  // Actions
  clearAppointments: () => set({ appointments: [] }),
  startAppointmentsListener: async (doctorId: string) => {
    if (get().unsubscribe) return; // Prevent multiple listeners

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
      set({ unsubscribe: null, appointments: [] });
    }
  },
}));

// Selectors
export const useAppointments = () =>
  useAppointmentStore((state) => state.appointments);

export const useIsFetchingAppointments = () =>
  useAppointmentStore((state) => state.isFetchingAppointments);

export const useAppointmentError = () =>
  useAppointmentStore((state) => state.error);

export const useStartAppointmentsListener = () =>
  useAppointmentStore((state) => state.startAppointmentsListener);

export const useStopAppointmentsListener = () =>
  useAppointmentStore((state) => state.stopAppointmentsListener);

export const useAppointmentsByDate = (date: string) => {
  const appointments = useAppointmentStore((state) => state.appointments);

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
