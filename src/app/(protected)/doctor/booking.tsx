import { functions } from "@/../firebaseConfig";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useDoctorById } from "@/stores/useDoctorSearch";
import { useUserData } from "@/stores/useUserStore";
import { TimeSlot } from "@/types/timeSlot";
import { formatDate } from "@/utils/bookingUtils";
import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { httpsCallable } from "firebase/functions";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = useDoctorById(id); // Doctor should already be fetched, so filter by id
  const userData = useUserData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const { control, handleSubmit, watch, setValue } = useForm<FieldValues>({
    defaultValues: {
      timeSlot: null, // Initialize with null
    },
  });

  const initializePaymentSheet = async ({
    amount,
    timeSlot,
  }: {
    amount: number;
    timeSlot: TimeSlot;
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

      Alert.alert("Success", "Booking was successful!");
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
        timeSlot: formData.timeSlot,
      });

      router.replace({
        pathname: `/(protected)/(tabs)/messages`,
      });
    } catch (error: any) {
      Alert.alert("Payment failed");
      setLoading(false);
    }
  };

  // Extract day of the week from selectedDate
  const dayOfWeek = selectedDate
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
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <View style={{ flex: 1 }}>
            <TextSemiBold style={{ fontSize: 20, color: "#000" }}>
              Dr. {doctor?.firstName} {doctor?.lastName}
            </TextSemiBold>
            <TextRegular
              style={{
                fontSize: 14,
                color: "#666",
                marginTop: 4,
              }}
            >
              {doctor?.specializations[0]}
            </TextRegular>
          </View>
          <View>
            <TextSemiBold style={{ fontSize: 20 }}>
              ${doctor?.consultationPrice}
            </TextSemiBold>
            <TextRegular style={{ fontSize: 12, color: "#666" }}>
              per consultation
            </TextRegular>
          </View>
        </View>

        {/* Date Selection */}
        <View>
          <TextSemiBold style={{ fontSize: 16, marginBottom: 12 }}>
            Select Date
          </TextSemiBold>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "#E5E5E5",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <TextRegular style={{ fontSize: 14, color: "#000" }}>
              {formatDate(selectedDate)}
            </TextRegular>
            <Ionicons name="calendar" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Time Slots */}
        <ControllerCheckBoxOptions
          label="Select a time slot"
          name="timeSlot"
          control={control}
          singleSelect
          options={timeSlotOptions}
          rules={{
            required: "Please select a time slot",
          }}
        />
        {timeSlotOptions.length === 0 && (
          <TextSemiBold style={{ color: Colors.lightText, fontSize: 14 }}>
            No available time slots for this date.
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
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={!watch("timeSlot") || loading}
          style={{
            backgroundColor: watch("timeSlot") ? Colors.black : "#E5E5E5",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <TextSemiBold
              style={{
                color: watch("timeSlot") ? "#FFF" : "#666",
                fontSize: 16,
              }}
            >
              Book Consultation
            </TextSemiBold>
          )}
        </TouchableOpacity>
      </View>

      <DatePicker
        modal
        mode="date"
        open={showDatePicker}
        minimumDate={new Date()}
        date={new Date(selectedDate)}
        onConfirm={(date) => {
          setShowDatePicker(false);
          setSelectedDate(date);
          setValue("timeSlot", null);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />
    </View>
  );
};

export default BookingPage;
