import { deleteItemFromMedicalRecord } from "@/api/medicalRecords";
import IconButton from "@/components/IconButton";
import PageScrollView from "@/components/PageScrollView";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import {
  useMedicalRecord,
  useRecordStoreAllergies,
} from "@/stores/useRecordStore";
import { Allergy, MedicalRecord } from "@/types/medicalRecord";
import { router, Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { auth } from "../../../../../../firebaseConfig";

const Allergies = () => {
  const allergies = useRecordStoreAllergies();
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
                  pathname: "/(protected)/(modals)/update-allergy",
                  params: { mode: "add", allergyId: "" },
                })
              }
            />
          ),
        }}
      />
      {allergies?.length === 0 && (
        <TextSemiBold
          style={{ textAlign: "center", marginTop: 16, color: Colors.grey }}
        >
          No allergies found.
        </TextSemiBold>
      )}
      {allergies?.map((allergy) => (
        <AllergyListItem
          key={allergy.id}
          id={allergy.id}
          medicalRecord={medicalRecord}
          name={allergy.name}
          reaction={allergy.reaction}
        />
      ))}
    </PageScrollView>
  );
};

export default Allergies;

const AllergyListItem = ({
  id,
  medicalRecord,
  name,
  reaction,
}: Allergy & { medicalRecord: MedicalRecord }) => {
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.nameContainer}>
        <TextSemiBold style={itemStyles.name}>{name}</TextSemiBold>
        <TextRegular
          style={itemStyles.reaction}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {reaction}
        </TextRegular>
      </View>
      <View style={itemStyles.buttons}>
        <IconButton
          name="stylus"
          onPress={() =>
            router.push({
              pathname: "/(protected)/(modals)/update-allergy",
              params: { mode: "edit", allergyId: id },
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
              "allergies"
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
    position: "relative",
  },
  nameContainer: {
    flexDirection: "column",
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  reaction: {
    fontSize: 16,
    color: Colors.grey,
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
  },
});
