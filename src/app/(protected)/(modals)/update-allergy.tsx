import { saveItem } from "@/api/medicalRecords";
import Footer from "@/components/AddFooter";
import ControllerInput from "@/components/form/ControllerInput";
import PageScrollView from "@/components/PageScrollView";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import {
  useMedicalRecord,
  useRecordStoreAllergyById,
} from "@/stores/useRecordStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { auth } from "../../../../firebaseConfig";

type AllergyForm = {
  name: string;
  reaction: string;
};

const UpdateAllergy = () => {
  const { mode, id } = useLocalSearchParams();
  const { height } = useGradualAnimation();
  const isEditMode = mode === "edit";
  const allergy = useRecordStoreAllergyById(id as string);
  const medicalRecord = useMedicalRecord();

  const initialValues =
    isEditMode && allergy
      ? { name: allergy.name, reaction: allergy.reaction }
      : { name: "", reaction: "" };

  const { control, handleSubmit, formState } = useForm<AllergyForm>({
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { isSubmitting, isValid, isDirty } = formState;

  const onSubmit: SubmitHandler<AllergyForm> = async (data) => {
    try {
      await saveItem(isEditMode, medicalRecord!, data, allergy, "allergies");

      router.dismiss();
    } catch (error) {
      console.error("Error saving allergy:", error);
    }
  };

  const fakeView = useAnimatedStyle(() => ({
    height: Math.abs(height.value),
  }));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isEditMode ? "Edit Allergy" : "Add Allergy" }}
      />
      <PageScrollView contentContainerStyle={styles.pageScrollViewContent}>
        <ControllerInput
          control={control}
          name="name"
          label="Allergy name"
          rules={{ required: "Allergy name is required" }}
          placeholder="e.g. Pollen"
        />
        <ControllerInput
          control={control}
          name="reaction"
          label="Reaction Description"
          rules={{ required: "Reaction description is required" }}
          placeholder="e.g. Hives and swelling"
          multiline
          textInputStyle={styles.multilineInputStyle}
        />
      </PageScrollView>

      <Footer
        keyboardHeightShared={height}
        canSubmit={isValid && isDirty}
        submitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      />

      <Animated.View style={fakeView} />
    </View>
  );
};

export default UpdateAllergy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageScrollViewContent: {
    flexDirection: "column",
    gap: 16,
  },
  multilineInputStyle: {
    height: 128,
  },
});
