import { db } from "@/../firebaseConfig";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUser } from "@/contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const interval = 30; // 30 minutes

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const startTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const endTime = `${hour.toString().padStart(2, "0")}:${(minute + interval)
        .toString()
        .padStart(2, "0")}`;
      slots.push({
        id: `${date.toISOString().split("T")[0]}-${startTime}-${endTime}`,
        startTime,
        endTime,
        isAvailable: true,
      });
    }
  }
  return slots;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const BookingPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: user } = useUser();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setSelectedSlot(null);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !doctor || !user) return;

    try {
      setIsBooking(true);

      // Create a new consultation document
      const consultationRef = doc(db, "appointments", `${id}-${Date.now()}`);
      await setDoc(consultationRef, {
        doctorId: id,
        patientId: user.uid,
        doctor: { firstName: doctor.firstName, lastName: doctor.lastName },
        patient: { firstName: user.firstName, lastName: user.lastName },
        timeSlot: selectedSlot,
        date: selectedDate,
        price: doctor.consultationPrice,
        status: "pending",
        createdAt: Timestamp.now(),
        scheduledFor: Timestamp.fromDate(
          new Date(
            selectedDate.setHours(
              parseInt(selectedSlot.startTime.split(":")[0])
            )
          )
        ),
      });

      router.replace("/(protected)/(tabs)");
    } catch (error) {
      console.error("Error booking consultation:", error);
    } finally {
      setIsBooking(false);
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
          disabled={!selectedSlot || isBooking}
          style={{
            backgroundColor: selectedSlot ? "#000" : "#E5E5E5",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          {isBooking ? (
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

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

export default BookingPage;
