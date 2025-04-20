import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DoctorHomeHeader from "../DoctorHomeHeader";
import { Calendar, DateData } from "react-native-calendars";
import { format } from "date-fns";
import { ScrollView } from "react-native-gesture-handler";
import { TextBold, TextRegular, TextSemiBold } from "../StyledText";

interface Consultation {
  id: number;
  patientName: string;
  startTime: string;
  endTime: string;
}

interface ConsultationsData {
  [date: string]: Consultation[];
}

// Mock data for consultations - replace with real data later
const mockConsultations: ConsultationsData = {
  "2025-04-19": [
    { id: 1, patientName: "Tyler", startTime: "09:00 AM", endTime: "9:15 AM" },
    { id: 2, patientName: "Emma", startTime: "09:30 AM", endTime: "9:45 AM" },
  ],
};

const DoctorHomeScreen = () => {
  const { data } = useUser();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const consultationsForDay = mockConsultations[selectedDate] || [];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <Stack.Screen
        options={{ title: "Doctor", header: () => <DoctorHomeHeader /> }}
      />

      {(data.verification === "unverified" || !data.verification) && (
        <VerificationAlert />
      )}
      {(data.verification === "pending" || !data.verification) && (
        <PendingAlert />
      )}
      {!data.hasPublicProfile && <MissingPublicProfileAlert />}

      <ScrollView style={{ padding: 16 }}>
        <Calendar
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#6366f1" },
            // Mark dates with consultations
            ...Object.keys(mockConsultations).reduce(
              (acc, date) => ({
                ...acc,
                [date]: { marked: true, dotColor: "#6366f1" },
              }),
              {}
            ),
          }}
          theme={{
            todayTextColor: "#6366f1",
            selectedDayBackgroundColor: "#6366f1",
            arrowColor: "#6366f1",
          }}
          style={{
            borderRadius: 10,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            backgroundColor: "#fff",
            marginBottom: 20,
          }}
        />

        <View>
          <TextSemiBold style={{ fontSize: 18, marginBottom: 12 }}>
            You have {consultationsForDay.length} patient consultations today
          </TextSemiBold>
          {consultationsForDay.map((consultation: Consultation) => (
            <View
              key={consultation.id}
              style={{
                backgroundColor: "#FFF5F5",
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#FFE4E4",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextBold style={{ fontSize: 16 }}>
                  {consultation.patientName}'s Consultation
                </TextBold>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <TextRegular style={{ color: "#666", marginTop: 4 }}>
                {consultation.startTime} - {consultation.endTime}
              </TextRegular>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorHomeScreen;

const VerificationAlert = () => {
  const handleNavigate = () => {
    router.push("/profile");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#FDECEA",
        padding: 12,
        margin: 16,

        borderColor: "#F5C6CB",
        borderWidth: 1,
        borderRadius: 12,
      }}
    >
      <Ionicons
        name="alert-circle-outline"
        size={20}
        color="#E53935"
        style={{ marginRight: 8 }}
      />
      <TextRegular
        style={{
          fontFamily: "dm",
          color: "#B71C1C",
          fontSize: 14,
          flex: 1,
          marginRight: 16,
        }}
      >
        Please verify your doctor account to be listed to patients!
      </TextRegular>
      <TouchableOpacity
        onPress={handleNavigate}
        style={{
          backgroundColor: "#E53935",
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
          alignSelf: "flex-start",
        }}
      >
        <TextSemiBold
          style={{
            fontFamily: "dm-sb",
            color: "white",
            fontWeight: "bold",
            fontSize: 13,
          }}
        >
          Go to Verification
        </TextSemiBold>
      </TouchableOpacity>
    </View>
  );
};

const PendingAlert = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF4E5",
        padding: 12,
        margin: 16,
        borderColor: "#FFD49C",
        borderWidth: 1,
        borderRadius: 12,
      }}
    >
      <Ionicons
        name="hourglass-outline"
        size={20}
        color="#FFA000"
        style={{ marginRight: 8 }}
      />
      <TextRegular
        style={{
          fontFamily: "dm",
          color: "#B26A00",
          fontSize: 14,
          flex: 1,
        }}
      >
        We are currently working to review your license. We'll notify you once
        it's approved.
      </TextRegular>
    </View>
  );
};

const MissingPublicProfileAlert = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDECEA",
        padding: 12,
        margin: 16,
        borderColor: "#F5C6CB",
        borderWidth: 1,
        borderRadius: 12,
      }}
    >
      <Ionicons
        name="alert-circle-outline"
        size={20}
        color="#E53935"
        style={{ marginRight: 8 }}
      />
      <TextRegular
        style={{
          fontFamily: "dm",
          color: "#B71C1C",
          fontSize: 14,
          flex: 1,
          marginRight: 16,
        }}
      >
        Your public profile is not yet set up. Set it up now so that patients
        can find you. you.
      </TextRegular>
    </View>
  );
};
