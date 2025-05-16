import PageScrollView from "@/components/PageScrollView";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";

const Edit = () => {
  const { id } = useLocalSearchParams();

  return (
    <PageScrollView>
      <Text>Edit</Text>
    </PageScrollView>
  );
};

export default Edit;
