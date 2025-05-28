import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";

const Divider = () => {
  return <View style={styles.divider} />;
};

export default Divider;

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.faintGrey,
    marginVertical: 8,
    flex: 1,
  },
});
