import PageScrollView from "@/components/PageScrollView";
import React from "react";
import { StyleSheet, Text } from "react-native";

const General = () => {
  return (
    <PageScrollView>
      <Text>General</Text>
    </PageScrollView>
  );
};

export default General;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
});
