import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type PageScrollViewProps = {
  children: ReactNode;
};

const PageScrollView = ({ children }: PageScrollViewProps) => {
  return <ScrollView style={styles.container}>{children}</ScrollView>;
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
