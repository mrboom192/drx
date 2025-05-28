import Divider from "@/components/Divider";
import ControllerInput from "@/components/form/ControllerInput";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useSession } from "@/contexts/AuthContext";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignIn = () => {
  const { signIn } = useSession();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { control, handleSubmit } = useForm<any>();

  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={62}
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.keyboardAwareScrollView}
    >
      <TextSemiBold style={styles.headerText}>Welcome to DrX</TextSemiBold>

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
        sensitive
        rules={{
          required: "Password is required",
          minLength: { value: 6, message: "At least 6 characters" },
        }}
      />

      <TouchableOpacity
        disabled={loading}
        style={[
          styles.loginButton,
          {
            opacity: loading ? 0.5 : 1,
          },
        ]}
        onPress={handleSubmit(onSubmit)}
      >
        <TextSemiBold style={styles.loginButtonText}>
          {loading ? "Loading..." : "Log in"}
        </TextSemiBold>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <Divider />
        <TextSemiBold style={styles.orText}>or</TextSemiBold>
        <Divider />
      </View>

      <TouchableOpacity
        disabled={loading}
        onPress={() => router.push("/signup")}
        style={[
          styles.signUpButton,
          {
            opacity: loading ? 0.5 : 1,
          },
        ]}
      >
        <TextSemiBold style={styles.signUpButtonText}>Sign up</TextSemiBold>
      </TouchableOpacity>

      <TextRegular style={styles.disclaimerText}>
        By using our app, you agree to our{" "}
        <Link href="/terms-of-service" asChild>
          <TextSemiBold style={styles.linkText}>Terms of Service</TextSemiBold>
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy">
          {" "}
          <TextSemiBold style={styles.linkText}>Privacy Policy</TextSemiBold>
        </Link>
        .
      </TextRegular>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

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
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#444",
  },
  signUpButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.grey,
  },
  signUpButtonText: {
    fontSize: 16,
    color: "#000",
  },
  disclaimerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 16,
    marginTop: 24,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});
