import PageScrollView from "@/components/PageScrollView";
import { TextSemiBold } from "@/components/StyledText";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Edit = () => {
  return (
    <PageScrollView>
      <Text>Edit</Text>

      <View>
        <TextSemiBold>Medication Name</TextSemiBold>
      </View>
    </PageScrollView>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
