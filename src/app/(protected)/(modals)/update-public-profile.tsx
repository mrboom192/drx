import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerInput from "@/components/form/ControllerInput";
import FormPage from "@/components/FormPage";
import LoadingScreen from "@/components/LoadingScreen";
import { TextSemiBold } from "@/components/StyledText";
import UserAvatar from "@/components/UserAvatar";
import Colors from "@/constants/Colors";
import { SPECIALIZATIONS } from "@/constants/specializations";
import {
  useFetchPublicProfile,
  useIsFetchingPublicProfile,
  usePublicProfile,
} from "@/stores/usePublicProfileStore";
import { useUserData } from "@/stores/useUserStore";
import { router } from "expo-router";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { db } from "../../../../firebaseConfig";

const countryCodeMap: { [key: string]: string } = {
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

  useEffect(() => {
    fetchPublicProfile();
  }, []);

  const { control, handleSubmit, formState, watch, reset } =
    useForm<FieldValues>({
      mode: "onChange",
      defaultValues: publicProfile
        ? {
            specializations: publicProfile.specializations || [],
            languages: publicProfile.languages || [],
            experience: publicProfile.experience?.toString() || "",
            biography: publicProfile.biography || "",
            countries: (publicProfile.countries || []).map(
              (code: string) => countryNameMap[code] || code
            ),
            consultationPrice:
              publicProfile.consultationPrice?.toString() || "",
            secondOpinionPrice:
              publicProfile.secondOpinionPrice?.toString() || "",
            radiologyPrice: publicProfile.radiologyPrice?.toString() || "",
            services: publicProfile.services || [],
          }
        : {},
    });

  const { isDirty, isValid, isSubmitting } = formState;
  const watchedServices = watch("services", []);

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    if (!userData) return;

    try {
      // Map selected country names to codes
      const selectedCountryCodes = (formData.countries || []).map(
        (countryName: string) => countryCodeMap[countryName] || countryName // fallback to name if not found
      );

      const dataToSave = {
        uid: userData.uid,
        specializations: formData.specializations || [],
        languages: formData.languages || [],
        experience: parseInt(formData.experience, 10) || 0,
        biography: formData.biography || "",
        countries: selectedCountryCodes, // <-- use country codes here
        consultationPrice: watchedServices?.includes("consultation")
          ? parseInt(formData.consultationPrice, 10) || 0
          : null,
        secondOpinionPrice: watchedServices?.includes("second opinion")
          ? parseInt(formData.secondOpinionPrice, 10) || 0
          : null,
        radiologyPrice: watchedServices?.includes("radiology")
          ? parseInt(formData.radiologyPrice, 10) || 0
          : null,
        services: formData.services || [],
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image || null,
        updatedAt: Timestamp.now(),
      };

      const publicProfileRef = doc(db, "publicProfiles", userData.uid);
      await setDoc(publicProfileRef, dataToSave, { merge: true });

      router.back(); // Go back after successful update
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
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <UserAvatar size={48} />
          <View>
            <TextSemiBold style={{ fontSize: 20, color: "#000" }}>
              Dr. {userData?.firstName + " " + userData?.lastName}
            </TextSemiBold>
            <TextSemiBold
              style={{
                fontSize: 14,
                color: Colors.onlineConsultation,
              }}
            >
              doctor
            </TextSemiBold>
          </View>
        </View>

        <ControllerCheckBoxOptions
          label="Languages"
          name="languages"
          control={control}
          rules={{ required: "At least one language is required" }}
          options={["english", "arabic", "hindu"]}
        />

        <ControllerInput
          label="Experience (in years)"
          placeholder="e.g. 5"
          name="experience"
          control={control}
          rules={{
            required: "Experience is required",
            pattern: {
              value: /^\d+$/,
              message: "Experience must be a valid number",
            },
          }}
          keyboardType="numeric"
        />

        <ControllerCheckBoxOptions
          label="Countries you are licensed in"
          name="countries"
          control={control}
          rules={{ required: "At least one is required" }}
          options={["United States", "Egypt", "Jordan", "India"]}
        />

        <ControllerInput
          label="Biography"
          placeholder="Tell us about yourself"
          name="biography"
          control={control}
          // Atleast 20 characters are required
          rules={{
            required: "Please create a biography",
          }}
          multiline
          textInputStyle={{ height: 128 }}
        />

        <ControllerCheckBoxOptions
          label="Select services you provide"
          name="services"
          control={control}
          // Atleast one service is required
          rules={{ required: "At least one service is required" }}
          options={["consultation", "second opinion", "radiology"]}
        />

        {watchedServices?.includes("consultation") && (
          <ControllerInput
            label="Consultation Price (in USD)"
            placeholder="e.g. 50"
            name="consultationPrice"
            control={control}
            rules={{
              required: watchedServices?.includes("consultation")
                ? "This field is required"
                : false,
            }}
            keyboardType="numeric"
            textInputStyle={{ width: "100%" }}
          />
        )}

        {watchedServices?.includes("second opinion") && (
          <ControllerInput
            label="Second Opinion Price (in USD)"
            placeholder="e.g. 50"
            name="secondOpinionPrice"
            rules={{
              required: watchedServices?.includes("second opinion")
                ? "This field is required"
                : false,
            }}
            control={control}
            keyboardType="numeric"
            textInputStyle={{ width: "100%" }}
          />
        )}

        {watchedServices?.includes("radiology") && (
          <ControllerInput
            label="Radiology Price (in USD)"
            placeholder="e.g. 50"
            name="radiologyPrice"
            control={control}
            rules={{
              required: watchedServices?.includes("radiology")
                ? "This field is required"
                : false,
            }}
            keyboardType="numeric"
            textInputStyle={{ width: "100%" }}
          />
        )}

        <ControllerCheckBoxOptions
          label="Specializations"
          name="specializations"
          control={control}
          options={SPECIALIZATIONS.map((spec) => spec.name)}
        />
      </FormPage>
    </View>
  );
};

export default UpdatePublicProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
