import { router } from "expo-router";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React from "react";
import { FieldValues, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import Colors from "@/constants/Colors";
import { useUserData } from "@/stores/useUserStore";
import { db } from "../../../../firebaseConfig";

import Divider from "@/components/Divider";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerInput from "@/components/form/ControllerInput";
import FormPage from "@/components/FormPage";
import LoadingScreen from "@/components/LoadingScreen";
import { TextSemiBold } from "@/components/StyledText";
import UserAvatar from "@/components/UserAvatar";
import { getSpecializations } from "@/constants/specializations";
import { useTranslation } from "react-i18next";
import { getCountryOptions } from "@/constants/countryCodes";
import ControllerAvailability from "@/components/form/ControllerAvailability";
import { PublicProfile } from "@/types/publicProfile";
import { fetchPublicProfile } from "@/api/publicProfile";
import { getCalendars } from "expo-localization";
import ControllerLocator from "@/components/form/ControllerLocator";

const UpdatePublicProfile = () => {
  const { t } = useTranslation();
  const userData = useUserData();
  const { control, handleSubmit, formState, watch, setValue } =
    useForm<PublicProfile>({
      mode: "onChange",
      defaultValues: async () => {
        const fallback: PublicProfile = {
          coordinates: null,
          specializations: [],
          languages: [],
          experience: "",
          biography: "",
          countries: [],
          services: [],
          consultationPrice: "",
          secondOpinionPrice: "",
          radiologyPrice: "",
          weightLossPrice: "",
          consultationDuration: "15",
          timeZone: getCalendars()[0].timeZone,
          availability: {
            Sun: [],
            Mon: [],
            Tue: [],
            Wed: [],
            Thu: [],
            Fri: [],
            Sat: [],
          },
        };

        const res = await fetchPublicProfile();

        if (!res) return fallback;

        return {
          ...fallback,
          ...res,
          experience: res.experience?.toString() || "",
          consultationPrice: res.consultationPrice?.toString() || "",
          secondOpinionPrice: res.secondOpinionPrice?.toString() || "",
          radiologyPrice: res.radiologyPrice?.toString() || "",
          weightLossPrice: res.weightLossPrice?.toString() || "",
          consultationDuration: res.consultationDuration?.toString() || "15",
        };
      },
    });

  const { isDirty, isValid, isSubmitting, isLoading } = formState;
  const watchedServices = useWatch({
    control,
    name: "services",
    defaultValue: [],
  });

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    if (!userData) return;

    const buildPrice = (service: string, field: string) =>
      watchedServices.includes(service)
        ? parseInt(formData[field], 10) || 0
        : null;

    try {
      await setDoc(
        doc(db, "publicProfiles", userData.uid),
        {
          uid: userData.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          image: userData.image || null,
          updatedAt: Timestamp.now(),
          specializations: formData.specializations || [],
          languages: formData.languages,
          experience: parseInt(formData.experience, 10) || 0,
          biography: formData.biography || "",
          countries: formData.countries,
          services: formData.services || [],
          consultationPrice: buildPrice("consultation", "consultationPrice"),
          secondOpinionPrice: buildPrice(
            "second opinion",
            "secondOpinionPrice"
          ),
          radiologyPrice: buildPrice("radiology", "radiologyPrice"),
          weightLossPrice: buildPrice("weight loss", "weightLossPrice"),
          consultationDuration:
            parseInt(formData.consultationDuration, 10) || 15,
          availability: formData.availability || {
            Sun: [],
            Mon: [],
            Tue: [],
            Wed: [],
            Thu: [],
            Fri: [],
            Sat: [],
          },
          timeZone: formData.timeZone,
          coordinates: formData.coordinates || null,
        },
        {
          merge: true,
        }
      );

      if (!userData.hasPublicProfile) {
        await setDoc(
          doc(db, "users", userData.uid),
          {
            hasPublicProfile: true,
          },
          { merge: true }
        );
      }

      router.back();
    } catch (error) {
      console.error("Error updating public profile:", error);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <FormPage
        canSubmit={isValid && isDirty}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <View style={styles.header}>
          <UserAvatar size={48} />
          <View>
            <TextSemiBold style={styles.nameText}>
              Dr. {userData?.firstName} {userData?.lastName}
            </TextSemiBold>
            <TextSemiBold style={styles.roleText}>
              {t("common.doctor")}
            </TextSemiBold>
          </View>
        </View>

        <ControllerCheckBoxOptions
          label={t("common.languages")}
          name="languages"
          control={control}
          rules={{ required: t("form.at-least-one-language-is-required") }}
          options={[
            { label: t("languages.english"), value: "en" },
            { label: t("languages.arabic"), value: "ar" },
            { label: t("languages.hindi"), value: "hi" },
          ]}
        />

        <ControllerCheckBoxOptions
          label={t("form.countries-you-are-licensed-in")}
          name="countries"
          control={control}
          rules={{ required: t("form.at-least-one-country-is-required") }}
          options={getCountryOptions(t)}
        />

        <ControllerInput
          label={t("form.experience-in-years")}
          placeholder={t("form.e-g-5")}
          name="experience"
          control={control}
          rules={{
            required: t("form.experience-is-required"),
            pattern: {
              value: /^\d+$/,
              message: t("form.must-be-a-valid-number"),
            },
          }}
          keyboardType="numeric"
        />

        <Divider />

        <ControllerInput
          label={t("form.biography")}
          placeholder={t("form.tell-us-about-yourself")}
          name="biography"
          control={control}
          rules={{ required: t("form.biography-is-required") }}
          multiline
          textInputStyle={{ height: 128 }}
        />

        <Divider />

        <ControllerCheckBoxOptions
          label={t("form.select-services-you-provide")}
          name="services"
          control={control}
          rules={{ required: t("form.at-least-one-service-is-required") }}
          options={[
            {
              label: t("appointment-types.consultation"),
              value: "consultation",
            },
            {
              label: t("appointment-types.second-opinion"),
              value: "second opinion",
            },
            { label: t("appointment-types.radiology"), value: "radiology" },
            { label: t("appointment-types.weight-loss"), value: "weight loss" },
          ]}
        />

        {watchedServices.includes("consultation") && (
          <ControllerInput
            key="consultation"
            label={t("form.service-price", {
              service: t("appointment-types.consultation"),
            })}
            placeholder={t("form.e-g-50")}
            name="consultationPrice"
            control={control}
            rules={{
              required: t("form.please-enter-a-price"),
              // Greater than 0 validation
              validate: (value) =>
                (typeof value === "string" && parseInt(value, 10) > 0) ||
                t("form.price-must-be-greater-than-zero"),
            }}
            keyboardType="numeric"
            textInputStyle={{ width: "100%" }}
          />
        )}
        {watchedServices.includes("second opinion") && (
          <ControllerInput
            key="second-opinion"
            label={t("form.service-price", {
              service: t("appointment-types.second-opinion"),
            })}
            placeholder={t("form.e-g-50")}
            name="secondOpinionPrice"
            control={control}
            rules={{
              required: t("form.please-enter-a-price"),
              validate: (value) =>
                (typeof value === "string" && parseInt(value, 10) > 0) ||
                t("form.price-must-be-greater-than-zero"),
            }}
            keyboardType="numeric"
            textInputStyle={{ width: "100%" }}
          />
        )}
        {watchedServices.includes("radiology") && (
          <ControllerInput
            key="radiology"
            label={t("form.service-price", {
              service: t("appointment-types.radiology"),
            })}
            placeholder={t("form.e-g-50")}
            name="radiologyPrice"
            control={control}
            rules={{
              required: t("form.please-enter-a-price"),
              validate: (value) =>
                (typeof value === "string" && parseInt(value, 10) > 0) ||
                t("form.price-must-be-greater-than-zero"),
            }}
            keyboardType="numeric"
            textInputStyle={{ width: "100%" }}
          />
        )}
        {watchedServices.includes("weight loss") && (
          <ControllerInput
            key="weight-loss"
            label={t("form.service-price", {
              service: t("appointment-types.weight-loss"),
            })}
            placeholder={t("form.e-g-50")}
            name="weightLossPrice"
            control={control}
            rules={{
              required: t("form.please-enter-a-price"),
              validate: (value) =>
                (typeof value === "string" && parseInt(value, 10) > 0) ||
                t("form.price-must-be-greater-than-zero"),
            }}
            keyboardType="numeric"
            textInputStyle={{ width: "100%" }}
          />
        )}

        <Divider />

        <ControllerLocator name="coordinates" control={control} />

        <Divider />

        <ControllerCheckBoxOptions
          label={t("common.specializations")}
          name="specializations"
          control={control}
          rules={{
            required: t("form.at-least-one-specialization-is-required"),
          }}
          options={getSpecializations(t)}
        />

        <Divider />

        <ControllerInput
          label={t("form.how-long-are-your-calls-in-minutes")}
          placeholder={t("form.e-g-15")}
          name="consultationDuration"
          control={control}
          rules={{
            required: t("form.duration-is-required"),
            pattern: {
              value: /^\d+$/,
              message: t("form.must-be-a-valid-number"),
            },
            validate: (value) =>
              (typeof value === "string" && parseInt(value, 10) >= 15) ||
              t("form.minimum-15-minutes"),
          }}
          keyboardType="numeric"
        />

        <ControllerAvailability
          label={t("form.availability")}
          control={control}
          name="availability"
          setValue={setValue}
          watch={watch}
        />
      </FormPage>
    </View>
  );
};

export default UpdatePublicProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", gap: 16, alignItems: "center" },
  nameText: { fontSize: 20, color: "#000" },
  roleText: { fontSize: 14, color: Colors.onlineConsultation },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  timeslotHeader: {
    fontSize: 14,
    color: Colors.black,
    textTransform: "capitalize",
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
    marginVertical: 4,
  },
  timeslotCount: {
    fontSize: 14,
    color: Colors.black,
    width: 24,
    textAlign: "center",
  },
});
