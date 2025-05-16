import IconButton from "@/components/IconButton";
import PageScrollView from "@/components/PageScrollView";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useRecordStoreMedications } from "@/stores/useRecordStore";
import { router, Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const Medications = () => {
  const medications = useRecordStoreMedications();

  return (
    <PageScrollView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <IconButton
              name="add"
              onPress={() =>
                router.push({
                  pathname: "/(protected)/(modals)/add",
                  params: {},
                })
              }
            />
          ),
        }}
      />
      {medications?.length === 0 && (
        <TextSemiBold
          style={{ textAlign: "center", marginTop: 16, color: Colors.grey }}
        >
          No medications found.
        </TextSemiBold>
      )}
      {medications?.map((medication) => (
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
        <IconButton
          name="stylus"
          onPress={() =>
            router.push({
              pathname: "/(protected)/(modals)/edit",
              params: {},
            })
          }
        />
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
