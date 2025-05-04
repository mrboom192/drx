import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserRow from "./UserRow";

const DoctorHomeHeader = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "#FFF" }}>
      <View
        style={{
          flexDirection: "column",
          gap: 10,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <UserRow />
      </View>
    </SafeAreaView>
  );
};

export default DoctorHomeHeader;
