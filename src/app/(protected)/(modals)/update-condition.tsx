import { saveItem } from "@/api/medicalRecords";
import Footer from "@/components/AddFooter";
import ControllerInput from "@/components/form/ControllerInput";
import PageScrollView from "@/components/PageScrollView";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import {
  useMedicalRecord,
  useRecordStoreConditionById,
} from "@/stores/useRecordStore"; // Update to use correct hook
import { Condition } from "@/types/medicalRecord";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

type ConditionForm = Pick<Condition, "name" | "comments">;

const UpdateCondition = () => {
  const { mode, id } = useLocalSearchParams();
  const { height } = useGradualAnimation();
  const isEditMode = mode === "edit";
  const condition = useRecordStoreConditionById(id as string);
  const medicalRecord = useMedicalRecord();

  const defaultValues: ConditionForm =
    isEditMode && condition
      ? {
          name: condition.name,
          comments: condition.comments || "", // Assuming comments field in condition
        }
      : {
          name: "",
          comments: "",
        };

  const { control, handleSubmit, formState } = useForm<ConditionForm>({
    defaultValues,
    mode: "onChange",
  });

  const { isDirty, isValid, isSubmitting } = formState;

  const onSubmit: SubmitHandler<ConditionForm> = async (data) => {
    try {
      await saveItem(isEditMode, medicalRecord!, data, condition, "conditions");
      router.dismiss();
    } catch (error) {
      console.error("Error saving condition:", error);
    }
  };

  const fakeView = useAnimatedStyle(() => ({
    height: Math.abs(height.value),
  }));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: `${isEditMode ? "Edit" : "Add"} Condition` }}
      />
      <PageScrollView contentContainerStyle={styles.pageScrollViewContent}>
        <ControllerInput
          control={control}
          name="name"
          rules={{ required: "Condition name is required" }}
          label="Condition Name"
          placeholder="e.g. Diabetes"
        />
        <ControllerInput
          control={control}
          name="comments"
          label="Condition Comments"
          placeholder="e.g. Additional details"
          multiline
          textInputStyle={styles.multilineInputStyle}
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

export default UpdateCondition;

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
