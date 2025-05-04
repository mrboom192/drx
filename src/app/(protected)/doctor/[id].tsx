import { db } from "@/../firebaseConfig";
import Avatar from "@/components/Avatar";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Biography from "@/components/screens/doctor/Biography";
import Specializations from "@/components/screens/doctor/Specializations";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PublicProfile {
  uid: string;
  firstName: string;
  lastName: string;
  image: string | null;
  specializations: string[];
  languages: string[];
  experience: number;
  biography: string;
  consultationPrice: number;
  updatedAt: any;
}

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [doctor, setDoctor] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const publicProfileRef = doc(db, "publicProfiles", id);
        const docSnap = await getDoc(publicProfileRef);

        if (docSnap.exists()) {
          setDoctor(docSnap.data() as PublicProfile);
        } else {
          setError("Doctor profile not found");
        }
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError("Failed to load doctor profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDoctorProfile();
    }
  }, [id]);

  const handleBooking = () => {
    router.push(`/doctor/booking?id=${id}`);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !doctor) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextRegular style={{ fontSize: 16, color: "#666" }}>
          {error || "Doctor not found"}
        </TextRegular>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "#fff", paddingBottom: insets.bottom }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 20,
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Doctor Info */}
        <View
          style={{
            flexDirection: "column",
            gap: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <Avatar size={48} uri={doctor.image || undefined} />
            <View style={{ flex: 1 }}>
              <TextSemiBold style={{ fontSize: 20, color: "#000" }}>
                Dr. {doctor.firstName} {doctor.lastName}
              </TextSemiBold>
            </View>
          </View>

          <Specializations doctor={doctor} />
        </View>

        {/* Languages */}
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}
          >
            <Ionicons name="language" size={20} color="#000" />
            <View style={{ flexDirection: "column", gap: 8 }}>
              <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
                Languages
              </TextSemiBold>
              <TextRegular
                style={{
                  fontSize: 16,
                  color: Colors.light.grey,
                  lineHeight: 20,
                }}
              >
                Dr. {doctor.firstName} speaks {doctor.languages?.join(", ")}.
              </TextRegular>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "column", gap: 8 }}>
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}
          >
            <Ionicons name="briefcase" size={20} color="#000" />
            <View style={{ flexDirection: "column", gap: 8 }}>
              <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
                Experience
              </TextSemiBold>
              <TextRegular
                style={{
                  fontSize: 16,
                  color: Colors.light.grey,
                  lineHeight: 20,
                }}
              >
                Dr. {doctor.firstName} has over {doctor.experience}+ years of
                experience.
              </TextRegular>
            </View>
          </View>
        </View>

        <Biography doctor={doctor} />
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          flexDirection: "row",
          padding: 16,
          borderTopWidth: 1,
          borderColor: Colors.light.faintGrey,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
        }}
      >
        <View>
          <TextRegular style={{ fontSize: 14, color: "#666" }}>
            Consultation Price
          </TextRegular>
          <TextSemiBold style={{ fontSize: 20 }}>
            ${doctor.consultationPrice}
          </TextSemiBold>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 8,
          }}
          onPress={handleBooking}
        >
          <TextSemiBold style={{ color: "#fff", fontSize: 16 }}>
            Book
          </TextSemiBold>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Page;
