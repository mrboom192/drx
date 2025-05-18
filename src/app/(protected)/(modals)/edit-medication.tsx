import { addMedication } from "@/api/medicalRecords";
import Footer from "@/components/AddFooter";
import PageScrollView from "@/components/PageScrollView";
import RegularTextInput from "@/components/RegularTextInput";
import { TextRegular } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import { useRecordStoreMedicationById } from "@/stores/useRecordStore";
import { Picker } from "@react-native-picker/picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { nanoid } from "nanoid";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { auth } from "../../../../firebaseConfig";

const AddMedication = () => {
  const { mode, medicationId } = useLocalSearchParams();
  const { height } = useGradualAnimation();
  const isEditMode = mode === "edit";
  const medication = useRecordStoreMedicationById(medicationId as string);
  const [submitting, setSubmitting] = useState(false);

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
    };
  }, []);

  const initialState =
    isEditMode && medication
      ? medication
      : {
          id: nanoid(),
          name: "",
          dosage: "",
          frequency: "",
          interval: "day",
        };

  const [formData, setFormData] = useState(initialState);

  const hasChange = useMemo(() => {
    if (!isEditMode || !medication) return false;
    return (
      medication.name !== formData.name ||
      medication.dosage !== formData.dosage ||
      medication.frequency !== formData.frequency ||
      medication.interval !== formData.interval
    );
  }, [formData, isEditMode, medication]);

  const canSubmit = useMemo(() => {
    return (
      formData.name.length > 0 &&
      formData.dosage.length > 0 &&
      formData.frequency.length > 0
    );
  }, [formData]);

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      await addMedication(auth.currentUser!.uid, formData);
      // Handle successful submission
    } catch (error) {
      // Handle error
      console.error("Error adding medication:", error);
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
          label="Medication Name"
          value={formData.name}
          onChangeText={(val) => handleChange("name", val)}
          placeholder="e.g. Atorvastatin"
        />
        <RegularTextInput
          label="Dosage"
          value={formData.dosage}
          onChangeText={(val) => handleChange("dosage", val)}
          placeholder="e.g. 10mg pill"
        />
        <View style={styles.frequencyContainer}>
          <View style={styles.frequencyRow}>
            <RegularTextInput
              value={formData.frequency}
              label="Frequency"
              keyboardType="numeric"
              onChangeText={(val) => handleChange("frequency", val)}
              placeholder="e.g. 2"
            />
            <TextRegular style={styles.timesPer}>times per</TextRegular>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={formData.interval}
                onValueChange={(itemValue) =>
                  handleChange("interval", itemValue)
                }
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Day" value="day" />
                <Picker.Item label="Week" value="week" />
                <Picker.Item label="Year" value="year" />
              </Picker>
            </View>
          </View>
        </View>
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

export default AddMedication;

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
