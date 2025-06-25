import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import FormPage from "@/components/FormPage";
import PageScrollView from "@/components/PageScrollView";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { getLanguageOptions } from "@/constants/languages";
import { useFilters, useSetFilters } from "@/stores/useFilterStore";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { router } from "expo-router";

interface LanguageFormValues {
  providerLanguages: string[];
}

const Page = () => {
  const { t } = useTranslation();
  const filters = useFilters();
  const setFilters = useSetFilters();

  const { control, formState, handleSubmit } = useForm<LanguageFormValues>({
    defaultValues: {
      providerLanguages: filters.providerLanguages,
    },
  });

  const { isDirty, isSubmitting } = formState;

  const onSubmit = (data: LanguageFormValues) => {
    setFilters({ providerLanguages: data.providerLanguages });
    router.back();
  };

  return (
    <FormPage
      canSubmit={isDirty}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit(onSubmit)}
    >
      <ControllerCheckBoxOptions
        label={t("form.provider-language")}
        control={control}
        name="providerLanguages"
        options={getLanguageOptions(t)}
      />
    </FormPage>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 64,
    height: 43,
    borderRadius: 16,
  },
});

export default Page;
