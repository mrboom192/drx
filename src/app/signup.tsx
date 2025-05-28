import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useSession } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity } from "react-native";

import Divider from "@/components/Divider";
import ControllerDatePicker from "@/components/form/ControllerDatePicker";
import ControllerInput from "@/components/form/ControllerInput";
import ControllerRoleSelector from "@/components/screens/signup/ControllerRoleSelector";
import { SignupUser } from "@/types/user";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const SignUp = () => {
  const { signUp } = useSession();
  const { control, handleSubmit } = useForm<any>({
    defaultValues: { role: "patient" },
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit: SubmitHandler<
    SignupUser & { password: string; email: string }
  > = async (data) => {
    // Data without password
    const { email, password, ...rest } = data;

    try {
      setSubmitting(true);
      await signUp(email, password, { ...rest }); // Due to how signUp is defined
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={62}
      style={styles.container}
      contentContainerStyle={styles.keyboardAwareScrollView}
    >
      {/* Role Selector */}
      <ControllerRoleSelector
        control={control}
        name="role"
        rules={{ required: "Please select a role" }}
      />

      {/* First Name */}
      <ControllerInput
        control={control}
        rules={{
          required: "First name is required",
        }}
        name="firstName"
        label={"First Name"}
        placeholder={"e.g. John"}
      />

      {/* Last Name */}
      <ControllerInput
        control={control}
        rules={{
          required: "Last name is required",
        }}
        name="lastName"
        label={"Last Name"}
        placeholder={"e.g. Doe"}
      />

      {/* Date of Birth */}
      <ControllerDatePicker
        control={control}
        name="dateOfBirth"
        label="Date of Birth"
        rules={{ required: "Date of birth is required" }}
      />

      <Divider />

      {/* Email */}
      <ControllerInput
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address.",
          },
        }}
        label="Email"
        name="email"
        placeholder="e.g. john@email.com"
      />

      {/* Password */}
      <ControllerInput
        control={control}
        name="password"
        label="Password"
        placeholder="Enter your password"
        rules={{
          required: "Password is required",
          minLength: { value: 6, message: "At least 6 characters" },
        }}
        sensitive
      />

      {/* Terms */}
      <TextRegular
        style={{
          fontSize: 12,
          color: "#666",
          textAlign: "center",
          lineHeight: 16,
          marginTop: 24,
        }}
      >
        By selecting Agree and continue, I agree to DrX's{" "}
        <TextRegular style={{ textDecorationLine: "underline" }}>
          Terms of Service, Payments Terms of Service and Nondiscrimination
          Policy
        </TextRegular>{" "}
        and acknowledge the{" "}
        <TextRegular style={{ textDecorationLine: "underline" }}>
          Privacy Policy
        </TextRegular>
        .
      </TextRegular>

      {/* Agree Button */}
      <TouchableOpacity
        disabled={submitting}
        style={{
          backgroundColor: "#000",
          borderRadius: 8,
          paddingVertical: 16,
          alignItems: "center",
          marginBottom: 64,
        }}
        onPress={handleSubmit(onSubmit)}
      >
        <TextSemiBold
          style={{
            color: "#fff",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {submitting ? "Signing up..." : "Agree and continue"}
        </TextSemiBold>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAwareScrollView: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "column",
    gap: 16,
    position: "relative",
  },
});
