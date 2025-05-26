import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type PageScrollViewProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const PageScrollView = ({ children, style }: PageScrollViewProps) => {
  return <ScrollView style={[styles.container, style]}>{children}</ScrollView>;
};

export default PageScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    position: "relative",
  },
});
