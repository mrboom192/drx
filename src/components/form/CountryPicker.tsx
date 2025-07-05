import { TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { TextRegular } from "../StyledText";
import Colors from "@/constants/Colors";
import CustomIcon from "../CustomIcon";
import { router } from "expo-router";

const CountryPicker = ({ emoji }: { emoji: string }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.navigate("/(protected)/(modals)/country-picker")}
    >
      <TextRegular>{emoji}</TextRegular>
      <CustomIcon name="keyboard-arrow-down" size={16} color={Colors.black} />
    </TouchableOpacity>
  );
};

export default CountryPicker;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.faintGrey,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
