import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserRow from "./UserRow";

const DoctorHomeHeader = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: "#FFF", paddingTop: insets.top }}>
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
    </View>
  );
};

export default DoctorHomeHeader;
