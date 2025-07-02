import { View, Text } from "react-native";
import React from "react";
import FormPage from "@/components/FormPage";
import { TextRegular } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import ControllerPhoneInput from "@/components/form/ControllerPhoneInput";
import { useTranslation } from "react-i18next";
import CountryPicker from "@/components/form/CountryPicker";

const AddPhone = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState } = useForm();
  const { isDirty, isSubmitting, isValid } = formState;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Data: ", data);
  };

  return (
    <FormPage
      submitButtonText="Verify"
      canSubmit={isDirty && isValid}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit(onSubmit)}
    >
      <TextRegular style={{ color: Colors.lightText }}>
        We'll text you a code to verify your phone number. Standard message and
        data rates apply.
      </TextRegular>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        <CountryPicker />
        <View style={{ flex: 1 }}>
          <ControllerPhoneInput
            label={t("form.phone-number")}
            control={control}
            name={"phoneNumber"}
            placeholder={t("form.e-g-1234567890")}
            autoFocus
          />
        </View>
      </View>
      {/* <CountryCodes /> */}
    </FormPage>
  );
};

export default AddPhone;
