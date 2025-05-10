import IconButton from "@/components/IconButton";
import CustomIcon from "@/components/icons/CustomIcon";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { format, parseISO } from "date-fns";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DayInfo = () => {
  const { date } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Fetch appointments for the selected date
  // Maybe use context instead

  return (
    <View style={[page.container, { paddingBottom: insets.bottom }]}>
      <Stack.Screen
        options={{
          presentation: "modal",
          header: () => <DayInfoHeader date={date as string} />,
        }}
      />
      <Text>{date}</Text>
    </View>
  );
};

export default DayInfo;

const DayInfoHeader = ({ date }: { date: string }) => {
  const insets = useSafeAreaInsets();

  // Replace fake values with actual data soon
  return (
    <View style={[header.container, { paddingTop: insets.top }]}>
      <IconButton name="close" onPress={() => router.back()} />
      <TextSemiBold style={header.date}>
        {format(parseISO(date), "MMMM d, yyyy")}
      </TextSemiBold>
      <View style={header.infoRow}>
        <View style={header.info}>
          <CustomIcon size={24} name="event-chair" />
          <TextSemiBold style={header.infoText}>3 Appointments</TextSemiBold>
        </View>
        <View style={header.info}>
          <CustomIcon size={24} name="schedule" />
          <TextSemiBold style={header.infoText}>30 mins total</TextSemiBold>
        </View>
      </View>
    </View>
  );
};

const page = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },
});

const header = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 16,
    flexDirection: "column",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey2,
  },
  date: {
    fontSize: 24,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
  },
});
