import { router } from "expo-router";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import Colors from "@/constants/Colors";
import { SPECIALIZATIONS } from "@/constants/specializations";
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

const countryCodeMap = {
  "United States": "us",
  Egypt: "eg",
  Jordan: "jo",
  India: "in",
};

const countryNameMap = Object.fromEntries(
  Object.entries(countryCodeMap).map(([name, code]) => [code, name])
);

const UpdatePublicProfile = () => {
  const userData = useUserData();
  const publicProfile = usePublicProfile();
  const fetchPublicProfile = useFetchPublicProfile();
  const isFetchingPublicProfile = useIsFetchingPublicProfile();

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

  const addTimeSlot = (day: string) => {
    setTimeSlotCounts((prev) => ({
      ...prev,
      [day]: (prev[day] || 1) + 1,
    }));
  };

  useEffect(() => {
    fetchPublicProfile();
  }, []);

  useEffect(() => {
    if (publicProfile) {
      reset({
        specializations: publicProfile.specializations || [],
        languages: publicProfile.languages || [],
        experience: publicProfile.experience?.toString() || "",
        biography: publicProfile.biography || "",
        countries: (publicProfile.countries || []).map(
          (code: string) => countryNameMap[code] || code
        ),
        consultationPrice: publicProfile.consultationPrice?.toString() || "",
        secondOpinionPrice: publicProfile.secondOpinionPrice?.toString() || "",
        weightLossPrice: publicProfile.weightLossPrice?.toString() || "",
        radiologyPrice: publicProfile.radiologyPrice?.toString() || "",
        services: publicProfile.services || [],
        availableDays: publicProfile.availableDays || [],
      });
    }
  }, [publicProfile, reset]);

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    if (!userData) return;

    const selectedCountryCodes = (formData.countries || []).map(
      (countryName: string) =>
        countryCodeMap[countryName as keyof typeof countryCodeMap] ||
        countryName
    );

    const buildPrice = (service: string, field: string) =>
      watchedServices.includes(service)
        ? parseInt(formData[field], 10) || 0
        : null;

    const timeSlots: { [day: string]: { start: string; end: string }[] } = {};
    watchedDays.forEach((day: string) => {
      const slots: { start: string; end: string }[] = [];
      for (let i = 0; i < (timeSlotCounts[day] || 1); i++) {
        const start = formData[`${day}_start_${i}`] || "";
        const end = formData[`${day}_end_${i}`] || "";
        if (start && end) slots.push({ start, end });
      }
      if (slots.length) timeSlots[day] = slots;
    });

    try {
      const dataToSave = {
        uid: userData.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image || null,
        updatedAt: Timestamp.now(),
        specializations: formData.specializations || [],
        languages: formData.languages || [],
        experience: parseInt(formData.experience, 10) || 0,
        biography: formData.biography || "",
        countries: selectedCountryCodes,
        services: formData.services || [],
        consultationPrice: buildPrice("consultation", "consultationPrice"),
        secondOpinionPrice: buildPrice("second opinion", "secondOpinionPrice"),
        radiologyPrice: buildPrice("radiology", "radiologyPrice"),
        weightLossPrice: buildPrice("weight loss", "weightLossPrice"),
        availableDays: formData.availableDays || [],
        availableTimeSlots: timeSlots,
      };

      await setDoc(doc(db, "publicProfiles", userData.uid), dataToSave, {
        merge: true,
      });
      router.back();
    } catch (error) {
      console.error("Error updating public profile:", error);
    }
  };

  if (isFetchingPublicProfile) return <LoadingScreen />;

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
            <TextSemiBold style={styles.roleText}>doctor</TextSemiBold>
          </View>
        </View>

        <ControllerCheckBoxOptions
          label="Languages"
          name="languages"
          control={control}
          rules={{ required: "At least one language is required" }}
          options={["english", "arabic", "hindu"]}
        />

        <ControllerCheckBoxOptions
          label="Countries you are licensed in"
          name="countries"
          control={control}
          rules={{ required: "At least one country is required" }}
          options={Object.keys(countryCodeMap)}
        />

        <ControllerInput
          label="Experience (in years)"
          placeholder="e.g. 5"
          name="experience"
          control={control}
          rules={{
            required: "Experience is required",
            pattern: { value: /^\d+$/, message: "Must be a valid number" },
          }}
          keyboardType="numeric"
        />

        <Divider />

        <ControllerInput
          label="Biography"
          placeholder="Tell us about yourself"
          name="biography"
          control={control}
          rules={{ required: "Biography is required" }}
          multiline
          textInputStyle={{ height: 128 }}
        />

        <Divider />

        <ControllerCheckBoxOptions
          label="Select services you provide"
          name="services"
          control={control}
          rules={{ required: "At least one service is required" }}
          options={[
            "consultation",
            "second opinion",
            "radiology",
            "weight loss",
          ]}
        />

        {["consultation", "second opinion", "radiology", "weight loss"].map(
          (service) =>
            watchedServices.includes(service) ? (
              <ControllerInput
                key={service}
                label={`${
                  service.charAt(0).toUpperCase() + service.slice(1)
                } Price (in USD)`}
                placeholder="e.g. 50"
                name={`${service.replace(" ", "")}Price`}
                control={control}
                rules={{ required: `Price for ${service} is required` }}
                keyboardType="numeric"
                textInputStyle={{ width: "100%" }}
              />
            ) : null
        )}

        <Divider />

        <ControllerCheckBoxOptions
          label="Specializations"
          name="specializations"
          control={control}
          rules={{ required: "At least one specialization is required" }}
          options={SPECIALIZATIONS.map((spec) => spec.name)}
        />

        <Divider />

        <ControllerInput
          label="How long are your calls? (in minutes)"
          control={control}
          placeholder="e.g. 15"
          name="consultationDuration"
          rules={{
            required: "Duration is required",
            pattern: { value: /^\d+$/, message: "Must be a valid number" },
          }}
          keyboardType="numeric"
        />

        <ControllerCheckBoxOptions
          label="What days are you available?"
          name="availableDays"
          control={control}
          rules={{ required: "At least one day is required" }}
          options={[
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ]}
        />

        {watchedDays.map((day: string) => (
          <View key={day}>
            <View style={styles.actionRow}>
              <TextRegular
                style={styles.timeslotHeader}
              >{`${day} time slots`}</TextRegular>
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
                    {index}
                  </TextSemiBold>
                  <View style={{ flex: 1 }}>
                    <ControllerTimePicker
                      name={`${day}_start_${index}`}
                      placeholder="Start time"
                      control={control}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ControllerTimePicker
                      name={`${day}_end_${index}`}
                      placeholder="End time"
                      control={control}
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
