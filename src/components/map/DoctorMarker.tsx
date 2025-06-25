import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { TextRegular, TextSemiBold } from "../StyledText";
import Colors from "@/constants/Colors";
import Avatar from "../Avatar";
import { router } from "expo-router";

type DoctorMarkerProps = {
  firstName: string;
  lastName: string;
  image: string;
  uid: string;
  shouldNavigate?: boolean;
};

const DoctorMarker = ({
  firstName,
  lastName,
  image,
  uid,
  shouldNavigate = true,
}: DoctorMarkerProps) => {
  return (
    <TouchableOpacity
      style={style.container}
      onPress={() =>
        shouldNavigate &&
        router.navigate({
          pathname: "/(protected)/doctor/[id]",
          params: { id: uid },
        })
      }
    >
      <View style={style.bubble}>
        <Avatar
          initials={`${firstName?.charAt(0)}${lastName?.charAt(0)}`}
          uri={image}
          size={28}
        />
        <TextRegular style={style.name}>Dr. {lastName}</TextRegular>
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
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderColor: Colors.faintGrey,
    borderWidth: 1,
  },
  name: {
    color: Colors.black,
    fontSize: 14,
  },
});

export default DoctorMarker;
