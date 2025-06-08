import { functions } from "@/../firebaseConfig";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerDatePicker from "@/components/form/ControllerDatePicker";
import Pills from "@/components/Pills";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import SubmitButton from "@/components/SubmitButton";
import Colors from "@/constants/Colors";
import { getSpecializations } from "@/constants/specializations";
import { useDoctorById } from "@/stores/useDoctorSearch";
import { useUserData } from "@/stores/useUserStore";
import { TimeSlot } from "@/types/timeSlot";
import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { httpsCallable } from "firebase/functions";
import i18next from "i18next";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type GetPaymentIntentRequest = {
  amount: number;
  currency: string;
  metadata?: any;
};

type GetPaymentIntentResponse = {
  paymentIntentId: string;
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
};

type CancelPaymentIntentRequest = {
  id: string;
};

type CancelPaymentIntentResponse = {
  success: boolean;
  canceledIntent?: any;
};

const getPaymentIntent = httpsCallable<
  GetPaymentIntentRequest,
  GetPaymentIntentResponse
>(functions, "getPaymentIntent");

const cancelPaymentIntent = httpsCallable<
  CancelPaymentIntentRequest,
  CancelPaymentIntentResponse
>(functions, "cancelPaymentIntent");

const BookingPage = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = useDoctorById(id); // Doctor should already be fetched, so filter by id
  console.log("Doctor data:", doctor);
  const userData = useUserData();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const insets = useSafeAreaInsets();

  const specializationMap = Object.fromEntries(
    getSpecializations(i18next.t).map((item) => [item.value, item.label])
  );

  // Map the specialization IDs to their names
  const specializations = doctor.specializations
    .map((specId: string) => specializationMap[specId])
    .filter(Boolean);

  const { control, handleSubmit, watch, setValue, formState } =
    useForm<FieldValues>({
      defaultValues: {
        selectedDate: new Date(),
        timeSlot: null, // Initialize with null
      },
    });

  const { isSubmitting } = formState;

  const initializePaymentSheet = async ({
    amount,
    timeSlot,
    selectedDate,
  }: {
    amount: number;
    timeSlot: TimeSlot;
    selectedDate: Date;
  }) => {
    if (!userData) {
      throw new Error("Patient not logged in!");
    }

    if (!amount || typeof amount !== "number") {
      throw new Error("Invalid or missing amount.");
    }

    try {
      const result = await getPaymentIntent({
        amount,
        currency: "usd",
        metadata: {
          patientId: userData.uid,
          doctorId: doctor.uid,
          date: selectedDate.toISOString(),
          timeSlot: JSON.stringify(timeSlot), // pass as string
        },
      });

      const { paymentIntentId, paymentIntent, ephemeralKey, customer } =
        result.data;

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "DRX Genius LLC",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        returnURL: Linking.createURL("stripe-redirect"),
        applePay: {
          merchantCountryCode: "US",
        },
      });

      if (initError) {
        throw new Error(initError.message);
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        await cancelPaymentIntent({ id: paymentIntentId });
        throw new Error(paymentError.message);
      }

      Alert.alert(t("common.success"), t("form.booking-was-successful"));
      return "success";
    } catch (err) {
      throw new Error("Failed to initialize payment sheet");
    }
  };

  // Move this to firebase functions in the future
  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    try {
      await initializePaymentSheet({
        amount: doctor?.consultationPrice,
        timeSlot: parseTimeSlot(formData.timeSlot),
        selectedDate: formData.selectedDate,
      });

      router.replace({
        pathname: `/(protected)/(tabs)/messages`,
      });
    } catch (error: any) {
      Alert.alert(t("form.payment-failed"));
    }
  };

  // Extract day of the week from selectedDate
  const dayOfWeek = watch("selectedDate")
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  // Get available slots for the selected date
  const rawSlots = doctor?.subTimeSlotsPerDuration?.[dayOfWeek] || [];

  // Map to "start-end" string format
  const timeSlotOptions: string[] = rawSlots.map(
    (slot: { start: string; end: string }) => `${slot.start}-${slot.end}`
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: "#FFF", paddingBottom: insets.bottom }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 24,
        }}
      >
        {/* Doctor Info */}
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <View style={{ flex: 1 }}>
            <TextSemiBold
              style={{ fontSize: 20, color: "#000", textAlign: "left" }}
            >
              {t("doctor.name", { lastName: doctor?.lastName })}
            </TextSemiBold>
            <Pills items={specializations || []} />
          </View>
          <View>
            <TextSemiBold style={{ fontSize: 20, textAlign: "right" }}>
              ${doctor?.consultationPrice}
            </TextSemiBold>
            <TextRegular
              style={{ fontSize: 12, color: "#666", textAlign: "right" }}
            >
              {t("doctor.per-consultation")}
            </TextRegular>
          </View>
        </View>

        <ControllerDatePicker
          label={t("form.select-date")}
          name="selectedDate"
          control={control}
          minimumDate={new Date()}
          maximumDate={undefined}
          rules={{
            required: t("form.please-select-a-date"),
          }}
        />

        {/* Time Slots */}
        <ControllerCheckBoxOptions
          label={t("form.select-a-time-slot")}
          name="timeSlot"
          control={control}
          singleSelect
          options={timeSlotOptions}
          rules={{
            required: t("form.please-select-a-time-slot"),
          }}
        />
        {timeSlotOptions.length === 0 && (
          <TextSemiBold
            style={{
              color: Colors.lightText,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {t("form.no-available-time-slots-for-this-date")}
          </TextSemiBold>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderColor: Colors.light.faintGrey,
          backgroundColor: "#fff",
        }}
      >
        <SubmitButton
          text={t("form.book-consultation")}
          onPress={handleSubmit(onSubmit)}
          disabled={!watch("timeSlot") || isSubmitting}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
};

export default BookingPage;

function parseTimeSlot(timeSlotStr: string) {
  const [startTime, endTime] = timeSlotStr.split("-");
  return { startTime, endTime };
}
