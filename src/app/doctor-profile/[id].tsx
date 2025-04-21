import {
  View,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/../firebaseConfig";
import Colors from "@/constants/Colors";
import Avatar from "@/components/Avatar";
import { TextRegular, TextSemiBold, TextBold } from "@/components/StyledText";

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !doctor) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextRegular style={{ fontSize: 16, color: "#666" }}>
          {error || "Doctor not found"}
        </TextRegular>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Stack.Screen
        options={{ title: "Doctor Profile", headerTitleAlign: "center" }}
      />

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
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <Avatar size={64} uri={doctor.image || undefined} />
          <View style={{ flex: 1 }}>
            <TextSemiBold style={{ fontSize: 20, color: "#000" }}>
              Dr. {doctor.firstName} {doctor.lastName}
            </TextSemiBold>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 8,
              }}
            >
              {doctor.specializations?.map((specialty: string, idx: number) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: idx === 0 ? "#8EFFC3" : "#E6E6FA",
                    paddingVertical: 4,
                    paddingHorizontal: 12,
                    borderRadius: 4,
                  }}
                >
                  <TextRegular
                    style={{
                      fontSize: 12,
                      color: "#333",
                      textTransform: "capitalize",
                    }}
                  >
                    {specialty}
                  </TextRegular>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Languages */}
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="language" size={20} color="#000" />
            <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
              Languages
            </TextSemiBold>
          </View>
          <TextRegular
            style={{
              fontSize: 14,
              color: Colors.light.grey,
              lineHeight: 20,
            }}
          >
            Dr. {doctor.firstName} speaks {doctor.languages?.join(", ")}.
          </TextRegular>
        </View>

        {/* Experience */}
        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="briefcase" size={20} color="#000" />
            <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
              Experience
            </TextSemiBold>
          </View>
          <TextRegular
            style={{
              fontSize: 14,
              color: "#444",
              lineHeight: 20,
            }}
          >
            Dr. {doctor.firstName} has over {doctor.experience}+ years of
            experience.
          </TextRegular>
        </View>

        {/* Bio */}
        <View style={{ flexDirection: "column", gap: 8 }}>
          <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
            Biography
          </TextSemiBold>
          <TextRegular
            style={{
              fontSize: 14,
              color: "#444",
              lineHeight: 20,
            }}
            numberOfLines={5}
          >
            {doctor.biography}
          </TextRegular>
          <TouchableOpacity>
            <TextSemiBold
              style={{
                fontSize: 14,
                color: "#000",
                marginTop: 8,
              }}
            >
              Show more
            </TextSemiBold>
          </TouchableOpacity>
        </View>
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
          onPress={() => router.push(`/doctor-profile/booking?id=${id}`)}
        >
          <TextSemiBold style={{ color: "#fff", fontSize: 16 }}>
            Book
          </TextSemiBold>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Page;
