import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import FormPage from "@/components/FormPage";
import { getLanguageOptions, getServiceOptions } from "@/constants/options";
import { useFilters, useSetFilters } from "@/stores/useFilterStore";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { useEffect } from "react";

interface LanguageFormValues {
  providerLanguages: string[];
  services: string[];
}

const Page = () => {
  const { t } = useTranslation();
  const filters = useFilters();
  const setFilters = useSetFilters();

  const { control, formState, handleSubmit, reset } =
    useForm<LanguageFormValues>({
      defaultValues: {
        providerLanguages: filters.providerLanguages,
        services: filters.services,
      },
    });

  const { isDirty, isSubmitting } = formState;

  useEffect(() => {
    reset({
      providerLanguages: filters.providerLanguages,
      services: filters.services,
    });
  }, [filters, reset]);

  const onSubmit = (data: LanguageFormValues) => {
    setFilters({
      providerLanguages: data.providerLanguages,
      services: data.services,
    });
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
      <ControllerCheckBoxOptions
        label={"Provider services"}
        control={control}
        name="services"
        options={getServiceOptions(t)}
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
