import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/../firebaseConfig";
import Colors from "@/constants/Colors";
import { useUser } from "@/contexts/UserContext";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const generateTimeSlots = (): TimeSlot[] => {
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
        id: `${startTime}-${endTime}`,
        startTime,
        endTime,
        isAvailable: true,
      });
    }
  }
  return slots;
};

const BookingPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: user } = useUser();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

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
      setTimeSlots(generateTimeSlots());
    }
  }, [id]);

  const handleBooking = async () => {
    if (!selectedSlot || !doctor || !user) return;

    try {
      setIsBooking(true);

      // Create a new consultation document
      const consultationRef = doc(db, "consultations", `${id}-${Date.now()}`);
      await setDoc(consultationRef, {
        doctorId: id,
        patientId: user.uid,
        patientName: `${user.firstName} ${user.lastName}`,
        doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        timeSlot: selectedSlot,
        price: doctor.consultationPrice,
        status: "pending",
        createdAt: Timestamp.now(),
        scheduledFor: Timestamp.fromDate(
          new Date(
            new Date().setHours(parseInt(selectedSlot.startTime.split(":")[0]))
          )
        ),
      });

      // Add consultation to doctor's consultations subcollection
      const doctorConsultationRef = doc(
        db,
        "doctors",
        id,
        "consultations",
        consultationRef.id
      );
      await setDoc(doctorConsultationRef, {
        consultationId: consultationRef.id,
        patientId: user.uid,
        patientName: `${user.firstName} ${user.lastName}`,
        timeSlot: selectedSlot,
        price: doctor.consultationPrice,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      // Add consultation to patient's consultations subcollection
      const patientConsultationRef = doc(
        db,
        "patients",
        user.uid,
        "consultations",
        consultationRef.id
      );
      await setDoc(patientConsultationRef, {
        consultationId: consultationRef.id,
        doctorId: id,
        doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        timeSlot: selectedSlot,
        price: doctor.consultationPrice,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      router.back();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Stack.Screen
        options={{
          title: "Book Consultation",
          headerTitleAlign: "center",
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

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
            <Text style={{ fontFamily: "dm-sb", fontSize: 20, color: "#000" }}>
              Dr. {doctor?.firstName} {doctor?.lastName}
            </Text>
            <Text
              style={{
                fontFamily: "dm",
                fontSize: 14,
                color: "#666",
                marginTop: 4,
              }}
            >
              {doctor?.specializations[0]}
            </Text>
          </View>
          <View>
            <Text style={{ fontFamily: "dm-sb", fontSize: 20 }}>
              ${doctor?.consultationPrice}
            </Text>
            <Text style={{ fontFamily: "dm", fontSize: 12, color: "#666" }}>
              per consultation
            </Text>
          </View>
        </View>

        {/* Time Slots */}
        <View>
          <Text style={{ fontFamily: "dm-sb", fontSize: 16, marginBottom: 16 }}>
            Select a Time Slot
          </Text>
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
                <Text
                  style={{
                    fontFamily: "dm",
                    fontSize: 14,
                    color: selectedSlot?.id === slot.id ? "#FFF" : "#000",
                  }}
                >
                  {slot.startTime} - {slot.endTime}
                </Text>
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
            <Text
              style={{
                fontFamily: "dm-sb",
                color: selectedSlot ? "#FFF" : "#666",
                fontSize: 16,
              }}
            >
              Book Consultation
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookingPage;
