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
import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { httpsCallable } from "firebase/functions";
import i18next from "i18next";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ------------------------------------------------------------------ */
/* ⚙️  Firebase cloud-function types                                  */
/* ------------------------------------------------------------------ */
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
type CancelPaymentIntentRequest = { id: string };
type CancelPaymentIntentResponse = { success: boolean; canceledIntent?: any };

const getPaymentIntent = httpsCallable<
  GetPaymentIntentRequest,
  GetPaymentIntentResponse
>(functions, "getPaymentIntent");

const cancelPaymentIntent = httpsCallable<
  CancelPaymentIntentRequest,
  CancelPaymentIntentResponse
>(functions, "cancelPaymentIntent");

/* ------------------------------------------------------------------ */
/* 🛠️  Local helpers                                                  */
/* ------------------------------------------------------------------ */
const WEEKDAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function weekdayKeyFromDate(date: Date) {
  return WEEKDAY_KEYS[date.getDay()];
}

/** Convert "hh:mm" to minutes since midnight. */
function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
/** Convert minutes to "hh:mm". */
function toTimeStr(mins: number) {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Split each availability range into sub-slots of `duration` minutes. */
function buildTimeSlotOptions(
  avail: { start: string; end: string }[],
  duration: number
): string[] {
  const res: string[] = [];
  avail.forEach(({ start, end }) => {
    let from = toMinutes(start);
    const until = toMinutes(end);
    while (from + duration <= until) {
      const slotStart = toTimeStr(from);
      const slotEnd = toTimeStr(from + duration);
      res.push(`${slotStart}-${slotEnd}`);
      from += duration;
    }
  });
  return res;
}

/* ------------------------------------------------------------------ */
/* 📄  BookingPage component                                          */
/* ------------------------------------------------------------------ */
const BookingPage = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = useDoctorById(id);
  const userData = useUserData();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const insets = useSafeAreaInsets();

  /* ---------- Translated specializations ---------- */
  const specializationMap = Object.fromEntries(
    getSpecializations(i18next.t).map((i) => [i.value, i.label])
  );
  const specializations =
    doctor?.specializations
      ?.map((spec: string) => specializationMap[spec])
      .filter(Boolean) || [];

  /* ---------- Form ---------- */
  const { control, handleSubmit, watch, formState } = useForm<FieldValues>({
    defaultValues: { selectedDate: new Date(), timeSlot: null },
  });
  const { isSubmitting } = formState;

  /* ---------- Build bookable time-slot list ---------- */
  const selectedDate: Date = watch("selectedDate");
  const weekdayKey = weekdayKeyFromDate(selectedDate);
  const rawRanges = doctor?.availability?.[weekdayKey] || [];
  const slotDuration = doctor?.consultationDuration || 15; // minutes
  const timeSlotOptions = buildTimeSlotOptions(rawRanges, slotDuration);

  /* ---------- Payment sheet ---------- */
  const initializePaymentSheet = async ({
    amount,
    timeSlot,
    selectedDate,
  }: {
    amount: number;
    timeSlot: string;
    selectedDate: Date;
  }) => {
    if (!userData) throw new Error("Patient not logged in");
    if (!amount) throw new Error("Missing amount");

    const result = await getPaymentIntent({
      amount,
      currency: "usd",
      metadata: {
        patientId: userData.uid,
        doctorId: doctor.uid,
        date: selectedDate.toISOString(),
        timeSlot: JSON.stringify(timeSlot),
      },
    });

    const { paymentIntentId, paymentIntent, ephemeralKey, customer } =
      result.data;

    const { error: initErr } = await initPaymentSheet({
      merchantDisplayName: "DRX Genius LLC",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      returnURL: Linking.createURL("stripe-redirect"),
      applePay: { merchantCountryCode: "US" },
    });
    if (initErr) throw new Error(initErr.message);

    const { error: payErr } = await presentPaymentSheet();
    if (payErr) {
      await cancelPaymentIntent({ id: paymentIntentId });
      throw new Error(payErr.message);
    }
    Alert.alert(t("common.success"), t("form.booking-was-successful"));
  };

  /* ---------- Submit ---------- */
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await initializePaymentSheet({
        amount: doctor?.consultationPrice,
        timeSlot: data.timeSlot,
        selectedDate: data.selectedDate,
      });
      router.replace({ pathname: "/(protected)/(tabs)/messages" });
    } catch {
      Alert.alert(t("form.payment-failed"));
    }
  };

  /* ---------- UI ---------- */
  return (
    <View
      style={{ flex: 1, backgroundColor: "#fff", paddingBottom: insets.bottom }}
    >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        {/* ─── Doctor header ──────────────────────────────────────────── */}
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
            <TextSemiBold style={{ fontSize: 20, color: "#000" }}>
              {t("doctor.name", { lastName: doctor?.lastName })}
            </TextSemiBold>
            <Pills items={specializations} />
          </View>
          <View>
            <TextSemiBold style={{ fontSize: 20, textAlign: "right" }}>
              ${doctor?.consultationPrice}
            </TextSemiBold>
            <TextRegular style={{ fontSize: 12, color: "#666" }}>
              {t("doctor.per-consultation")}
            </TextRegular>
          </View>
        </View>

        {/* ─── Date picker ───────────────────────────────────────────── */}
        <ControllerDatePicker
          label={t("form.select-date")}
          name="selectedDate"
          control={control}
          minimumDate={new Date()}
          rules={{ required: t("form.please-select-a-date") }}
        />

        {/* ─── Time-slot picker ──────────────────────────────────────── */}
        <ControllerCheckBoxOptions
          label={t("form.select-a-time-slot")}
          name="timeSlot"
          control={control}
          singleSelect
          options={timeSlotOptions}
          rules={{ required: t("form.please-select-a-time-slot") }}
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

      {/* ─── Bottom CTA ───────────────────────────────────────────────*/}
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderColor: Colors.light.faintGrey,
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

/* ------------------------------------------------------------------ */
/* 🔎  Helpers                                                         */
/* ------------------------------------------------------------------ */
export function parseTimeSlot(str: string) {
  const [startTime, endTime] = str.split("-");
  return { startTime, endTime };
}
