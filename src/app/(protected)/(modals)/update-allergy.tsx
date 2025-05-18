import {
  addItemToMedicalRecord,
  updateItemInMedicalRecord,
} from "@/api/medicalRecords";
import Footer from "@/components/AddFooter";
import PageScrollView from "@/components/PageScrollView";
import RegularTextInput from "@/components/RegularTextInput";
import Colors from "@/constants/Colors";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import {
  useMedicalRecord,
  useRecordStoreAllergyById,
} from "@/stores/useRecordStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { nanoid } from "nanoid";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { auth } from "../../../../firebaseConfig";

const UpdateAllergy = () => {
  const { mode, allergyId } = useLocalSearchParams();
  const { height } = useGradualAnimation();
  const isEditMode = mode === "edit";
  const allergy = useRecordStoreAllergyById(allergyId as string);
  const medicalRecord = useMedicalRecord();
  const [submitting, setSubmitting] = useState(false);

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
    };
  }, []);

  const initialState =
    isEditMode && allergy
      ? allergy
      : {
          id: nanoid(),
          name: "",
          reaction: "",
        };

  const [formData, setFormData] = useState(initialState);

  const hasChange = useMemo(() => {
    if (!isEditMode || !allergy) return true;
    return (
      allergy.name !== formData.name || allergy.reaction !== formData.reaction
    );
  }, [formData, isEditMode, allergy]);

  const canSubmit = useMemo(() => {
    return formData.name.length > 0 && formData.reaction.length > 0;
  }, [formData]);

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setSubmitting(true);

      if (isEditMode) {
        await updateItemInMedicalRecord(
          auth.currentUser!.uid,
          medicalRecord!,
          formData,
          "allergies"
        );
      } else {
        await addItemToMedicalRecord(
          auth.currentUser!.uid,
          "allergies",
          formData
        );
      }
    } catch (error) {
      // Handle error
      console.error("Error adding allergy:", error);
    } finally {
      setSubmitting(false);
      router.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isEditMode ? "Edit Medication" : "Add Medication" }}
      />
      <PageScrollView>
        <RegularTextInput
          label="Allergy name"
          value={formData.name}
          onChangeText={(val) => handleChange("name", val)}
          placeholder="e.g. Pollen"
        />
        <RegularTextInput
          label="Reaction description"
          value={formData.reaction}
          onChangeText={(val) => handleChange("reaction", val)}
          placeholder="e.g. Hives and swelling"
          multiline
        />
      </PageScrollView>

      <Footer
        keyboardHeightShared={height}
        canSubmit={canSubmit && hasChange}
        submitting={submitting}
        handleSubmit={handleSubmit}
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
  frequencyContainer: {},
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  frequencyInput: {
    flex: 1,
    marginRight: 8,
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
