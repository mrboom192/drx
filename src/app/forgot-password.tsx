import { View, Text } from "react-native";
import React, { useState } from "react";
import PageScrollView from "@/components/PageScrollView";
import SubmitButton from "@/components/SubmitButton";
import ControllerInput from "@/components/form/ControllerInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";

const Page = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const [messageSent, setMessageSent] = useState(false);

  const onPress: SubmitHandler<FieldValues> = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
    } catch (error) {
      // Log or handle specific error
    } finally {
      setMessageSent(true);
    }
  };

  return (
    <PageScrollView
      contentContainerStyle={{
        padding: 16,
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Message shown after attempt */}
      {messageSent && (
        <TextSemiBold style={{ color: Colors.green }}>
          {t("recover.success")}
        </TextSemiBold>
      )}

      {/* Email input */}
      <ControllerInput
        control={control}
        rules={{
          required: t("common.email-required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("common.email-invalid"),
          },
        }}
        label={t("common.email")}
        name="email"
        placeholder={t("common.email-placeholder")}
      />

      {/* Submit button */}
      <SubmitButton
        text={t("recover.send-email")}
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(onPress)}
      />
    </PageScrollView>
  );
};

export default Page;
