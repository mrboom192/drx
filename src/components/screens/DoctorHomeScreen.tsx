import { useUser } from "@/contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db } from "../../../firebaseConfig";
import DoctorCalendar from "../Calendar/DoctorCalendar";
import DoctorHomeHeader from "../DoctorHomeHeader";
import { TextRegular, TextSemiBold } from "../StyledText";

const DoctorHomeScreen = () => {
  const { data } = useUser();
  const [appointments, setAppointments] = useState<any>([]);
  const [status, setStatus] = useState<string>("loading");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!data) {
        setStatus("error");
        return;
      }

      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("doctorId", "==", data.uid));
        const querySnapshot = await getDocs(q);

        const appointmentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(appointmentsList);
      } catch (err) {
        console.error("Error fetching doctor profile:", err); // For debugg
        setStatus("error");
      } finally {
        setStatus("success");
      }
    };

    fetchAppointments();
  }, [data]);

  if (status === "loading") {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#FFF", paddingTop: insets.top }}
      >
        <TextRegular style={{ textAlign: "center", marginTop: 20 }}>
          Loading...
        </TextRegular>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#FFF", paddingTop: insets.top }}
      >
        <TextRegular style={{ textAlign: "center", marginHorizontal: 16 }}>
          There was an error fetching your appointments. Please try again later.
        </TextRegular>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF", paddingTop: insets.top }}>
      <Stack.Screen
        options={{ title: "Doctor", header: () => <DoctorHomeHeader /> }}
      />

      {(data?.verification === "unverified" || !data?.verification) && (
        <VerificationAlert />
      )}
      {(data?.verification === "pending" || !data?.verification) && (
        <PendingAlert />
      )}
      {!data?.hasPublicProfile && <MissingPublicProfileAlert />}

      <DoctorCalendar consultations={null} />
    </View>
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
            color: "white",
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
