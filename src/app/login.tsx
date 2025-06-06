import Divider from "@/components/Divider";
import ControllerInput from "@/components/form/ControllerInput";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import SubmitButton from "@/components/SubmitButton";
import Colors from "@/constants/Colors";
import { useSession } from "@/contexts/AuthContext";
import { Link, router } from "expo-router";
import { FirebaseError } from "firebase/app";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "login",
  });
  const { signIn } = useSession();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      setError("other", {
        type: "custom",
        message: getErrorMessage(error, t),
      });
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
      <TextSemiBold style={styles.headerText}>{t("header")}</TextSemiBold>

      {/* Email */}
      <ControllerInput
        control={control}
        rules={{
          required: t("emailRequired"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("emailInvalid"),
          },
        }}
        label={t("email")}
        name="email"
        placeholder={t("emailPlaceholder")}
      />

      {/* Password */}
      <ControllerInput
        control={control}
        name="password"
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        sensitive
        rules={{
          required: t("passwordRequired"),
          minLength: { value: 6, message: t("passwordMinLength") },
        }}
      />

      <View style={styles.loginButtonContainer}>
        {typeof errors.other?.message === "string" && (
          <TextRegular style={styles.error}>{errors.other.message}</TextRegular>
        )}
        <SubmitButton
          text={t("login")}
          loading={loading}
          disabled={loading}
          onPress={() => {
            clearErrors("other");
            handleSubmit(onSubmit)();
          }}
        />
      </View>

      <View style={styles.orContainer}>
        <Divider />
        <TextSemiBold style={styles.orText}>{t("or")}</TextSemiBold>
        <Divider />
      </View>

      <SubmitButton
        text={t("signup")}
        variant="secondary"
        disabled={loading}
        onPress={() => router.navigate("/signup")}
      />

      <TextRegular style={styles.disclaimerText}>
        {t("disclaimerStart")}{" "}
        <Link href="/terms-of-service">
          <TextSemiBold style={styles.linkText}>{t("terms")}</TextSemiBold>
        </Link>{" "}
        {t("and")}{" "}
        <Link href="/privacy-policy">
          <TextSemiBold style={styles.linkText}>{t("privacy")}</TextSemiBold>
        </Link>
        {t("period")}
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
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#444",
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
  loginButtonContainer: {
    position: "relative",
    marginTop: 20,
  },
  error: {
    position: "absolute",
    top: -24,
    left: 0,
    color: Colors.pink,
    fontSize: 12,
  },
});

function getErrorMessage(
  error: FirebaseError,
  t: (key: string) => string
): string {
  if (!(error instanceof FirebaseError)) {
    return t("error.unknown");
  }

  switch (error.code) {
    case "auth/invalid-credential":
      return t("error.invalidCredentials");
    default:
      return t("unknown");
  }
}
