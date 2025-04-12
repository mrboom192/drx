import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import DoctorHomeHeader from "../DoctorHomeHeader";

const DoctorHomeScreen = () => {
  const { data } = useUser();

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
      <Text
        style={{
          fontFamily: "dm",
          color: "#B71C1C",
          fontSize: 14,
          flex: 1,
          marginRight: 16,
        }}
      >
        Please verify your doctor account to be listed to patients!
      </Text>
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
        <Text
          style={{
            fontFamily: "dm-sb",
            color: "white",
            fontWeight: "bold",
            fontSize: 13,
          }}
        >
          Go to Verification
        </Text>
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
      <Text
        style={{
          fontFamily: "dm",
          color: "#B26A00",
          fontSize: 14,
          flex: 1,
        }}
      >
        We are currently working to review your license. We’ll notify you once
        it’s approved.
      </Text>
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
      <Text
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
      </Text>
    </View>
  );
};
