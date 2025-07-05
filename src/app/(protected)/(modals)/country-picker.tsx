import React from "react";
import CountryCodes from "@/components/CountryCodes";
import { View, StyleSheet } from "react-native";

const CountryPicker = () => {
  return (
    <View style={styles.container}>
      <CountryCodes />
    </View>
  );
};

export default CountryPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
});
