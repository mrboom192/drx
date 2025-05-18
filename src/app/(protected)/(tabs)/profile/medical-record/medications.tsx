import { deleteItemFromMedicalRecord } from "@/api/medicalRecords";
import IconButton from "@/components/IconButton";
import PageScrollView from "@/components/PageScrollView";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import {
  useMedicalRecord,
  useRecordStoreMedications,
} from "@/stores/useRecordStore";
import { MedicalRecord, Medication } from "@/types/medicalRecord";
import { router, Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { auth } from "../../../../../../firebaseConfig";

const Medications = () => {
  const medications = useRecordStoreMedications();
  const medicalRecord = useMedicalRecord();

  if (!medicalRecord) {
    return (
      <TextSemiBold
        style={{ textAlign: "center", marginTop: 16, color: Colors.grey }}
      >
        Error: No medical record found.
      </TextSemiBold>
    );
  }

  return (
    <PageScrollView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <IconButton
              name="add"
              onPress={() =>
                router.push({
                  pathname: "/(protected)/(modals)/update-medication",
                  params: { mode: "add", medicationId: "" },
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
          medicalRecord={medicalRecord}
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

const TRUNCATE_LENGTH = 15;

const MedicationListItem = ({
  id,
  medicalRecord,
  name,
  dosage,
  interval,
  frequency,
}: Medication & { medicalRecord: MedicalRecord }) => {
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.nameContainer}>
        <TextSemiBold
          style={itemStyles.name}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </TextSemiBold>
        <TextRegular
          style={itemStyles.dosage}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {dosage}
        </TextRegular>
      </View>
      <TextSemiBold style={itemStyles.frequency}>
        {frequency}/{interval}
      </TextSemiBold>
      <View style={itemStyles.buttons}>
        <IconButton
          name="stylus"
          onPress={() =>
            router.push({
              pathname: "/(protected)/(modals)/update-medication",
              params: { mode: "edit", medicationId: id },
            })
          }
        />
        <IconButton
          name="close"
          onPress={() => {
            deleteItemFromMedicalRecord(
              auth.currentUser!.uid,
              medicalRecord,
              id,
              "medications"
            );
          }}
        />
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
  },
  nameContainer: {
    flexDirection: "column",
    flex: 1,
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
    flex: 1,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    flex: 1,
  },
});
