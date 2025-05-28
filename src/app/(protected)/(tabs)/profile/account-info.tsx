import Divider from "@/components/Divider";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerDatePicker from "@/components/form/ControllerDatePicker";
import ControllerInput from "@/components/form/ControllerInput";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUserData } from "@/stores/useUserStore";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { db } from "../../../../../firebaseConfig";

const AccountInfo = () => {
  const userData = useUserData();

  const { control, handleSubmit, formState, reset } = useForm<any>({
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      phoneNumber: userData?.phone || "",
      dateOfBirth: userData?.dateOfBirth ? userData.dateOfBirth.toDate() : null,
      gender: userData?.gender || "",
    },
  });

  const { isDirty, isSubmitting } = formState;

  if (!userData) return null;

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const processedData = {
        ...data,
        gender: data.gender ? data.gender.toLowerCase() : "",
        // Convert dateOfBirth to Firestore Timestamp if it exists
        dateOfBirth: data.dateOfBirth
          ? Timestamp.fromDate(data.dateOfBirth)
          : null,
      };

      await setDoc(doc(db, "users", userData.uid), processedData, {
        merge: true,
      });

      // Reset the form with processed data to clear dirty state
      reset({
        ...processedData,
        dateOfBirth: processedData.dateOfBirth.toDate() || null,
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Something went wrong saving your info.");
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={62}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <ControllerInput
        label={"First Name"}
        control={control}
        name={"firstName"}
        rules={{ required: "First name is required" }}
        placeholder={"e.g. John"}
      />
      <ControllerInput
        label={"Last Name"}
        control={control}
        name={"lastName"}
        rules={{ required: "Last name is required" }}
        placeholder={"e.g. Doe"}
      />

      <Divider />

      <ControllerInput
        label={"Phone Number"}
        control={control}
        name={"phoneNumber"}
        placeholder={"e.g. 1234567890"}
        keyboardType={"phone-pad"}
      />
      <ControllerDatePicker
        label={"Date of Birth"}
        control={control}
        name={"dateOfBirth"}
        rules={{ required: "Date of birth is required" }}
        placeholder={"Select your date of birth"}
      />

      <Divider />

      <ControllerCheckBoxOptions
        label={"Gender"}
        control={control}
        name={"gender"}
        options={["male", "female", "other"]}
        singleSelect
      />

      <Divider />

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={!isDirty || isSubmitting}
        style={[
          styles.saveButton,
          { opacity: isDirty && !isSubmitting ? 1 : 0.5 },
        ]}
      >
        <TextSemiBold style={styles.saveButtonText}>
          {isSubmitting ? "Saving..." : "Save"}
        </TextSemiBold>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

export default AccountInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    backgroundColor: "#fff",
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 16,
    position: "relative",
  },
  saveButton: {
    backgroundColor: Colors.black,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
