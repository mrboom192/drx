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
  price: string;
  shouldNavigate?: boolean;
};

const DoctorMarker = ({
  firstName,
  lastName,
  image,
  uid,
  price,
  shouldNavigate = true,
}: DoctorMarkerProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        shouldNavigate &&
        router.navigate({
          pathname: "/(protected)/doctor/[id]",
          params: { id: uid },
        })
      }
    >
      <View style={styles.bubble}>
        <Avatar
          initials={`${firstName?.charAt(0)}${lastName?.charAt(0)}`}
          uri={image}
          size={28}
        />
        <View style={styles.textContainer}>
          <TextRegular style={styles.name}>Dr. {lastName}</TextRegular>
          <TextSemiBold style={styles.price}>${price}</TextSemiBold>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  textContainer: {
    flexDirection: "column",
    marginLeft: 8,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  bubble: {
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    borderColor: Colors.faintGrey,
    borderWidth: 1,
  },
  name: {
    color: Colors.black,
    fontSize: 12,
  },
  price: {
    color: Colors.black,
    fontSize: 10,
  },
});

export default DoctorMarker;
