import { router } from "expo-router";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import Colors from "@/constants/Colors";
import {
  useFetchPublicProfile,
  useIsFetchingPublicProfile,
  usePublicProfile,
} from "@/stores/usePublicProfileStore";
import { useUserData } from "@/stores/useUserStore";
import { db } from "../../../../firebaseConfig";

import Divider from "@/components/Divider";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerInput from "@/components/form/ControllerInput";
import ControllerTimePicker from "@/components/form/ControllerTimePicker";
import FormPage from "@/components/FormPage";
import IconButton from "@/components/IconButton";
import LoadingScreen from "@/components/LoadingScreen";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import UserAvatar from "@/components/UserAvatar";
import { getSpecializations } from "@/constants/specializations";
import { useTranslation } from "react-i18next";
import { getCountryOptions } from "@/constants/countryCodes";
import { getDayOptions } from "@/constants/days";
import ConotrollerContextMenu from "@/components/form/ControllerContextMenu";
import { set } from "date-fns";

const UpdatePublicProfile = () => {
  const { t } = useTranslation();
  const userData = useUserData();
  const publicProfile = usePublicProfile();
  const fetchPublicProfile = useFetchPublicProfile();
  const isFetchingPublicProfile = useIsFetchingPublicProfile();
  const [currentWatchedDays, setCurrentWatchedDays] = useState<string[]>([]);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const { control, handleSubmit, formState, watch, reset } =
    useForm<FieldValues>({
      mode: "onChange",
      defaultValues: {},
    });

  const { isDirty, isValid, isSubmitting } = formState;
  const watchedServices = watch("services", []);
  const watchedDays = watch("availableDays", []);

  // Dynamic time slots per day
  const [timeSlotCounts, setTimeSlotCounts] = useState<{
    [day: string]: number;
  }>({});

  const addTimeSlot = (day: any) => {
    setTimeSlotCounts((prev) => ({
      ...prev,
      [day.value]: (prev[day.value] || 1) + 1,
    }));
  };

  useEffect(() => {
    fetchPublicProfile();
  }, []);

  useEffect(() => {
    if (publicProfile) {
      const defaultValues: FieldValues = {
        specializations: publicProfile.specializations || [],
        languages: publicProfile.languages,
        experience: publicProfile.experience?.toString() || "",
        biography: publicProfile.biography || "",
        countries: publicProfile.countries,
        consultationPrice: publicProfile.consultationPrice?.toString() || "",
        secondOpinionPrice: publicProfile.secondOpinionPrice?.toString() || "",
        weightLossPrice: publicProfile.weightLossPrice?.toString() || "",
        radiologyPrice: publicProfile.radiologyPrice?.toString() || "",
        services: publicProfile.services || [],
        availableDays: publicProfile.availableDays || [],
        consultationDuration:
          publicProfile.consultationDuration?.toString() || "",
      };

      const slotCounts: { [day: string]: number } = {};
      const availableTimeSlots = publicProfile.availableTimeSlots || {};

      Object.entries(availableTimeSlots).forEach(([day, slots]) => {
        if (Array.isArray(slots)) {
          slotCounts[day] = slots.length;
          slots.forEach((slot, index) => {
            // Ensure start and end times are "HH:mm"
            defaultValues[`${day}_start_${index}`] = slot.start; // e.g., "09:00"
            defaultValues[`${day}_end_${index}`] = slot.end; // e.g., "12:00"
          });
        }
      });

      reset(defaultValues);
      setTimeSlotCounts(slotCounts);
    }
  }, [publicProfile, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.availableDays) {
        setCurrentWatchedDays(value.availableDays);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    if (!userData) return;

    const buildPrice = (service: string, field: string) =>
      watchedServices.includes(service)
        ? parseInt(formData[field], 10) || 0
        : null;

    const consultationDuration =
      parseInt(formData.consultationDuration, 10) || 15;

    const timeSlots: { [day: string]: { start: string; end: string }[] } = {};
    const subTimeSlots: { [day: string]: { start: string; end: string }[] } =
      {};

    for (const day of watchedDays) {
      const slots: { start: string; end: string }[] = [];
      const subSlots: { start: string; end: string }[] = [];

      for (let i = 0; i < (timeSlotCounts[day] || 1); i++) {
        const startStr = formData[`${day}_start_${i}`];
        const endStr = formData[`${day}_end_${i}`];

        if (startStr && endStr) {
          const [startHour, startMin] = startStr.split(":").map(Number);
          const [endHour, endMin] = endStr.split(":").map(Number);

          const startDate = new Date();
          startDate.setHours(startHour, startMin, 0, 0);
          const endDate = new Date();
          endDate.setHours(endHour, endMin, 0, 0);

          if (startDate >= endDate) {
            alert(
              `Error on ${day}, slot ${
                i + 1
              }: start time must be before end time.`
            );
            return;
          }

          slots.push({ start: startStr, end: endStr });
        }
      }

      // Check for overlaps
      slots.sort((a, b) => a.start.localeCompare(b.start));
      for (let j = 0; j < slots.length - 1; j++) {
        const currEnd = new Date();
        const nextStart = new Date();

        const [currEndHour, currEndMin] = slots[j].end.split(":").map(Number);
        const [nextStartHour, nextStartMin] = slots[j + 1].start
          .split(":")
          .map(Number);

        currEnd.setHours(currEndHour, currEndMin, 0, 0);
        nextStart.setHours(nextStartHour, nextStartMin, 0, 0);

        if (currEnd > nextStart) {
          alert(
            `Error on ${day}: time slots ${j + 1} and ${
              j + 2
            } overlap. Please merge them.`
          );
          return;
        }
      }

      // Subdivide time slots
      for (const slot of slots) {
        const [startHour, startMin] = slot.start.split(":").map(Number);
        const [endHour, endMin] = slot.end.split(":").map(Number);
        let current = new Date();
        current.setHours(startHour, startMin, 0, 0);
        const endDate = new Date();
        endDate.setHours(endHour, endMin, 0, 0);

        while (current < endDate) {
          const subStart = new Date(current);
          const subEnd = new Date(current);
          subEnd.setMinutes(subEnd.getMinutes() + consultationDuration);

          if (subEnd > endDate) break;

          subSlots.push({
            start: subStart.toTimeString().slice(0, 5),
            end: subEnd.toTimeString().slice(0, 5),
          });

          current = subEnd;
        }
      }

      if (slots.length) timeSlots[day] = slots;
      if (subSlots.length) subTimeSlots[day] = subSlots;
    }

    try {
      const dataToSave = {
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
        secondOpinionPrice: buildPrice("second opinion", "secondOpinionPrice"),
        radiologyPrice: buildPrice("radiology", "radiologyPrice"),
        weightLossPrice: buildPrice("weight loss", "weightLossPrice"),
        consultationDuration: formData.consultationDuration,
        availableDays: formData.availableDays || [],
        availableTimeSlots: timeSlots,
        subTimeSlotsPerDuration: subTimeSlots,
      };

      await setDoc(doc(db, "publicProfiles", userData.uid), dataToSave, {
        merge: true,
      });
      router.back();
    } catch (error) {
      console.error("Error updating public profile:", error);
    }
  };

  if (isFetchingPublicProfile && !isLayoutReady) return <LoadingScreen />;

  return (
    <View style={styles.container} onLayout={() => setIsLayoutReady(true)}>
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

        {[
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
        ].map((service) =>
          watchedServices.includes(service.value) ? (
            <ControllerInput
              key={service.value}
              label={t("form.service-price", {
                service: service.label,
              })}
              placeholder={t("form.e-g-50")}
              name={`${toCamelCase(service.value)}Price`}
              control={control}
              rules={{ required: t("form.please-enter-a-price") }}
              keyboardType="numeric"
              textInputStyle={{ width: "100%" }}
            />
          ) : null
        )}

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

        <ConotrollerContextMenu
          label={t("form.how-long-are-your-calls-in-minutes")}
          control={control}
          rules={{ required: t("form.duration-is-required") }}
          options={[
            { label: "15 minutes", value: "15" },
            { label: "30 minutes", value: "30" },
            { label: "45 minutes", value: "45" },
            { label: "1 hour", value: "60" },
          ]}
          name="consultationDuration"
        />

        <ControllerCheckBoxOptions
          label={t("form.what-days-are-you-available")}
          name="availableDays"
          control={control}
          rules={{ required: t("form.at-least-one-day-is-required") }}
          options={getDayOptions(t)}
        />

        {currentWatchedDays.map((day: any) => (
          <View key={day}>
            <View style={styles.actionRow}>
              <TextRegular style={styles.timeslotHeader}>
                {t("form.day-label-time-slots", { day: day.label })}
              </TextRegular>
              <IconButton
                size={24}
                name="add"
                onPress={() => addTimeSlot(day)}
              />
            </View>

            {Array.from({ length: timeSlotCounts[day] || 1 }).map(
              (_, index) => (
                <View key={`${day}_${index}`} style={styles.timeSlot}>
                  <TextSemiBold style={styles.timeslotCount}>
                    {index + 1}
                  </TextSemiBold>
                  <View style={{ flex: 1 }}>
                    <ControllerTimePicker
                      name={`${day}_start_${index}`}
                      placeholder={t("form.start-time")}
                      control={control}
                      rules={{
                        required: t("form.start-time-is-required"),
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ControllerTimePicker
                      name={`${day}_end_${index}`}
                      placeholder={t("form.end-time")}
                      control={control}
                      rules={{
                        required: t("form.end-time-is-required"),
                      }}
                    />
                  </View>
                </View>
              )
            )}
          </View>
        ))}
      </FormPage>
    </View>
  );
};

export default UpdatePublicProfile;

const toCamelCase = (str: string) =>
  str
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");

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
