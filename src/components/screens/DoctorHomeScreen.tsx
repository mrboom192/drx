import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const DoctorHomeScreen = () => {
  const { data } = useUser();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <Stack.Screen options={{ title: "Doctor" }} />

      {!data.isVerifiedDoctor && <VerificationAlert />}
      <Text>DoctorHomeScreen</Text>
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
