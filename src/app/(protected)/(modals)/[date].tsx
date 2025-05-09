import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const DayInfo = () => {
  const { date } = useLocalSearchParams();

  // Fetch appointments for the selected date

  return (
    <View>
      <Text>{date}</Text>
    </View>
  );
};

export default DayInfo;
