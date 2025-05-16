import PageScrollView from "@/components/PageScrollView";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";

const Add = () => {
  const { id } = useLocalSearchParams();

  return (
    <PageScrollView>
      <Text>Add</Text>
    </PageScrollView>
  );
};

export default Add;
