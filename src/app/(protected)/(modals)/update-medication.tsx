import {
  addItemToMedicalRecord,
  updateItemInMedicalRecord,
} from "@/api/medicalRecords";
import Footer from "@/components/AddFooter";
import Divider from "@/components/Divider";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerInput from "@/components/form/ControllerInput";
import PageScrollView from "@/components/PageScrollView";
import Colors from "@/constants/Colors";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import {
  useMedicalRecord,
  useRecordStoreMedicationById,
} from "@/stores/useRecordStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { auth } from "../../../../firebaseConfig";

type MedicationForm = {
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  interval: string;
};

const UpdateMedication = () => {
  const { mode, medicationId } = useLocalSearchParams();
  const { height } = useGradualAnimation();
  const isEditMode = mode === "edit";
  const medication = useRecordStoreMedicationById(medicationId as string);
  const medicalRecord = useMedicalRecord();

  useEffect(() => {
    console.log(medicationId);
  }, [medicationId]);

  const defaultValues =
    isEditMode && medication
      ? {
          name: medication.name,
          dosage: medication.dosage || "", // fallback if older data
          route: medication.route || "",
          frequency: medication.frequency,
          interval: medication.interval,
        }
      : {
          name: "",
          dosage: "",
          route: "",
          frequency: "",
          interval: "day",
        };

  const { control, handleSubmit, formState } = useForm<MedicationForm>({
    defaultValues,
    mode: "onChange",
  });

  const { isDirty, isValid, isSubmitting } = formState;

  const onSubmit: SubmitHandler<MedicationForm> = async (data) => {
    try {
      const payload = isEditMode
        ? { ...medication, ...data, id: medication!.id }
        : { id: nanoid(), ...data };

      if (isEditMode) {
        await updateItemInMedicalRecord(
          auth.currentUser!.uid,
          medicalRecord!,
          payload,
          "medications"
        );
      } else {
        await addItemToMedicalRecord(
          auth.currentUser!.uid,
          "medications",
          payload
        );
      }

      router.dismiss();
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  const fakeView = useAnimatedStyle(() => ({
    height: Math.abs(height.value),
  }));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isEditMode ? "Edit Medication" : "Add Medication" }}
      />
      <PageScrollView contentContainerStyle={styles.pageScrollViewContent}>
        <ControllerInput
          control={control}
          name="name"
          rules={{ required: "Medication name is required" }}
          label="Medication Name"
          placeholder="e.g. Atorvastatin"
        />
        <ControllerInput
          control={control}
          name="dosage"
          rules={{ required: "Dosage amount is required" }}
          label="Dosage"
          placeholder="e.g. 10mg"
          keyboardType="default"
        />
        <ControllerCheckBoxOptions
          control={control}
          name="route"
          label="Medication Route"
          options={[
            "oral",
            "topical",
            "inhalation",
            "nasal",
            "ocular",
            "otic",
            "rectal",
            "vaginal",
            "intravenous",
            "intramuscular",
            "subcutaneous",
          ]}
          rules={{ required: "Please select a dosage route" }}
          singleSelect
        />
        <Divider />
        <ControllerInput
          control={control}
          rules={{
            required: "Please enter a frequency",
          }}
          name="frequency"
          label={"How often do you take this?"}
          placeholder={"e.g. 2"}
          keyboardType="numeric"
        />
        <ControllerCheckBoxOptions
          control={control}
          label={"What is the interval?"}
          name="interval"
          options={["daily", "monthly", "weekly"]}
          rules={{ required: "Please select an interval" }}
          singleSelect
        />
      </PageScrollView>

      <Footer
        keyboardHeightShared={height}
        canSubmit={isDirty && isValid}
        submitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      />

      <Animated.View style={fakeView} />
    </View>
  );
};

export default UpdateMedication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageScrollViewContent: {
    flexDirection: "column",
    gap: 16,
  },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timesPer: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  dropdownWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
});
