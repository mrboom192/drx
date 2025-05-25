import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useSession } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import ControllerDatePicker from "@/components/ControllerDatePicker";
import ControllerInput from "@/components/ControllerInput";
import ControllerRoleSelector from "@/components/screens/signup/ControllerRoleSelector";
import { SignupUser } from "@/types/user";
import { useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const SignUp = () => {
  const { email } = useLocalSearchParams();
  const { signUp } = useSession();
  const { control, handleSubmit } = useForm<any>({
    defaultValues: { role: "patient" },
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit: SubmitHandler<SignupUser & { password: string }> = async (
    data
  ) => {
    // Data without password
    const { password, ...rest } = data;

    try {
      setSubmitting(true);
      await signUp(email as string, data.password, { ...rest });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={62}
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
            marginBottom: 24,
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
    </View>
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
    position: "relative",
  },
});
