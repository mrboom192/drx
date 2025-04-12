import { View, Text, SafeAreaView } from "react-native";
import React from "react";
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
