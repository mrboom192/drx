import IconButton from "@/components/IconButton";
import PageScrollView from "@/components/PageScrollView";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const medicationsMockData = [
  {
    id: 1,
    name: "Ibuprofen",
    dosage: "200mg",
    interval: "day",
    frequency: 2,
  },
  {
    id: 2,
    name: "Paracetamol",
    dosage: "500mg",
    interval: "day",
    frequency: 3,
  },
  {
    id: 3,
    name: "Amoxicillin",
    dosage: "250mg",
    interval: "day",
    frequency: 1,
  },
  {
    id: 4,
    name: "Lisinopril",
    dosage: "10mg",
    interval: "day",
    frequency: 1,
  },
];

const Medications = () => {
  return (
    <PageScrollView>
      <Stack.Screen
        options={{
          headerRight: () => <IconButton name="add" />,
        }}
      />
      {medicationsMockData.map((medication) => (
        <MedicationListItem
          key={medication.id}
          id={medication.id}
          name={medication.name}
          dosage={medication.dosage}
          interval={medication.interval}
          frequency={medication.frequency}
        />
      ))}
    </PageScrollView>
  );
};

export default Medications;

type MedicationListItemProps = {
  id: string | number;
  name: string;
  dosage: string;
  interval: string;
  frequency: number;
};

const MedicationListItem = ({
  name,
  dosage,
  interval,
  frequency,
}: MedicationListItemProps) => {
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.nameContainer}>
        <TextSemiBold style={itemStyles.name}>{name}</TextSemiBold>
        <TextRegular style={itemStyles.dosage}>{dosage}</TextRegular>
      </View>
      <TextSemiBold style={itemStyles.frequency}>
        {frequency}/{interval}
      </TextSemiBold>
      <View style={itemStyles.buttons}>
        <IconButton name="stylus" />
        <IconButton name="close" />
      </View>
    </View>
  );
};

const itemStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  nameContainer: {
    flexDirection: "column",
  },
  name: {
    fontSize: 16,
  },
  dosage: {
    fontSize: 16,
    color: Colors.grey,
  },
  frequency: {
    fontSize: 16,
    position: "absolute",
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
  },
});
