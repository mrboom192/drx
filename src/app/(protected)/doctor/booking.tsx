import { db, functions } from "@/../firebaseConfig";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUserData } from "@/stores/useUserStore";
import { TimeSlot } from "@/types/timeSlot";
import { formatDate, generateTimeSlots } from "@/utils/bookingUtils";
import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import "react-native-get-random-values";
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
  const userData = useUserData();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const publicProfileRef = doc(db, "publicProfiles", id);
        const docSnap = await getDoc(publicProfileRef);

        if (docSnap.exists()) {
          setDoctor(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDoctorProfile();
      setTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [id, selectedDate]);

  const initializePaymentSheet = async ({ amount }: { amount: number }) => {
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
          timeSlot: JSON.stringify(selectedSlot), // pass as string
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
        Alert.alert("Payment failed", paymentError.message);
        cancelPaymentIntent({
          id: paymentIntentId,
        });
        throw new Error(paymentError.message);
      }

      Alert.alert("Success", "Booking was successful!");
      return;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  // Move this to firebase functions in the future
  const handleBooking = async () => {
    if (!selectedSlot || !doctor || !userData) return;

    setLoading(true);

    try {
      await initializePaymentSheet({
        amount: doctor?.consultationPrice,
      });

      router.replace({
        pathname: `/(protected)/(tabs)/messages`,
      });
    } catch (error: any) {
      Alert.alert("Error", error);
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
        <View>
          <TextSemiBold style={{ fontSize: 16, marginBottom: 16 }}>
            Select a Time Slot
          </TextSemiBold>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                onPress={() => setSelectedSlot(slot)}
                style={{
                  backgroundColor:
                    selectedSlot?.id === slot.id ? "#000" : "#F5F5F5",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor:
                    selectedSlot?.id === slot.id ? "#000" : "#E5E5E5",
                }}
              >
                <TextRegular
                  style={{
                    fontSize: 14,
                    color: selectedSlot?.id === slot.id ? "#FFF" : "#000",
                  }}
                >
                  {slot.startTime} - {slot.endTime}
                </TextRegular>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
          onPress={handleBooking}
          disabled={!selectedSlot}
          style={{
            backgroundColor: selectedSlot ? "#000" : "#E5E5E5",
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
                color: selectedSlot ? "#FFF" : "#666",
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
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />
    </View>
  );
};

export default BookingPage;
