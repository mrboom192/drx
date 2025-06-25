import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { TextSemiBold } from "../StyledText";
import Colors from "@/constants/Colors";

const DoctorMarker = ({ count }: { count: number }) => {
  return (
    <TouchableOpacity style={style.container}>
      <View style={style.bubble}>
        <TextSemiBold style={style.count}>{count}</TextSemiBold>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  bubble: {
    width: 40,
    height: 40,
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    padding: 4,
    borderRadius: 8,
    borderColor: Colors.faintGrey,
    borderWidth: 1,
  },
  count: {
    color: Colors.black,
    fontSize: 16,
  },
});

export default DoctorMarker;
