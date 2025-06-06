import { saveItem } from "@/api/medicalRecords";
import Divider from "@/components/Divider";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerInput from "@/components/form/ControllerInput";
import FormPage from "@/components/FormPage";
import {
  useMedicalRecord,
  useRecordStoreMedicationById,
} from "@/stores/useRecordStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

type MedicationForm = {
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  interval: string;
};

const UpdateMedication = () => {
  const { mode, id } = useLocalSearchParams();
  const isEditMode = mode === "edit";
  const medication = useRecordStoreMedicationById(id as string);
  const medicalRecord = useMedicalRecord();

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
      await saveItem(
        isEditMode,
        medicalRecord!,
        data,
        medication,
        "medications"
      );

      router.dismiss();
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: `${isEditMode ? "Edit" : "Add"} Medication` }}
      />

      <FormPage
        canSubmit={isValid && isDirty}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      >
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
      </FormPage>
    </View>
  );
};

export default UpdateMedication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
