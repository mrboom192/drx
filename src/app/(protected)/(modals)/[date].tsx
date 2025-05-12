import Avatar from "@/components/Avatar";
import IconButton from "@/components/IconButton";
import CustomIcon from "@/components/icons/CustomIcon";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { Appointment } from "@/types/appointment";
import { addDays, format, parseISO, startOfDay } from "date-fns";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db } from "../../../../firebaseConfig";

const DayInfo = () => {
  const { date } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments for the selected date
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsRef = collection(db, "appointments");

        const selectedDate = parseISO(date as string); // Convert "2025-05-13" to JS Date
        const start = Timestamp.fromDate(startOfDay(selectedDate));
        const end = Timestamp.fromDate(startOfDay(addDays(selectedDate, 1)));

        const q = query(
          appointmentsRef,
          where("date", ">=", start),
          where("date", "<", end)
        );

        const querySnapshot = await getDocs(q);
        const appointmentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(appointmentsData as Appointment[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={page.container}>
      <Stack.Screen
        options={{
          header: () => <DayInfoHeader date={date as string} />,
        }}
      />
      <ScrollView
        style={{ flex: 1, paddingBottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {appointments.length === 0 && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 32,
            }}
          >
            <TextSemiBold style={{ fontSize: 16, color: Colors.grey }}>
              No appointments for this date.
            </TextSemiBold>
          </View>
        )}
        {appointments.map((appointment) => (
          <TouchableOpacity
            key={appointment.id}
            style={{
              marginBottom: 16,
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightGrey2,
              paddingVertical: 16,
            }}
            onPress={() =>
              router.replace(
                `/(protected)/(chat)/${appointment.patientId}_${appointment.doctorId}`
              )
            }
          >
            <View style={{ flexDirection: "column", gap: 8 }}>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <Avatar uri={appointment.patient.image} size={24} />
                <TextSemiBold style={{ fontSize: 16 }}>
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </TextSemiBold>
              </View>

              <TextSemiBold style={{ fontSize: 16 }}>
                Time:{" "}
                <TextRegular>
                  {appointment.timeSlot.startTime} -{" "}
                  {appointment.timeSlot.endTime}
                </TextRegular>
              </TextSemiBold>

              <TextSemiBold style={{ fontSize: 16 }}>
                Type: <TextRegular>Consultation</TextRegular>
              </TextSemiBold>
            </View>

            <View
              style={{
                width: 64,
                height: 64,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9999,
                backgroundColor: Colors.secondOpinionBackground,
              }}
            >
              <CustomIcon
                name="event-chair"
                size={32}
                color={Colors.secondOpinion}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default DayInfo;

const DayInfoHeader = ({ date }: { date: string }) => {
  const insets = useSafeAreaInsets();

  // Replace fake values with actual data soon
  return (
    <View
      style={[
        header.container,
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <IconButton name="close" onPress={() => router.back()} />
      <TextSemiBold style={header.date}>
        {format(parseISO(date), "MMMM d, yyyy")}
      </TextSemiBold>
      <View style={header.infoRow}>
        <View style={header.info}>
          <CustomIcon size={24} name="event-chair" />
          <TextSemiBold style={header.infoText}>3 Appointments</TextSemiBold>
        </View>
        <View style={header.info}>
          <CustomIcon size={24} name="schedule" />
          <TextSemiBold style={header.infoText}>30 mins total</TextSemiBold>
        </View>
      </View>
    </View>
  );
};

const page = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
  },
});

const header = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 16,
    flexDirection: "column",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey2,
  },
  date: {
    fontSize: 24,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
  },
});
