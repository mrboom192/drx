import { db } from "@/../firebaseConfig";
import Avatar from "@/components/Avatar";
import LoadingScreen from "@/components/LoadingScreen";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import CustomIcon from "@/components/CustomIcon";
import Biography from "@/components/screens/doctor/Biography";
import Specializations from "@/components/screens/doctor/Specializations";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getLanguageOptions } from "@/constants/options";
import { PublicProfile } from "@/types/publicProfile";

const Page = () => {
  const { t } = useTranslation();
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
    router.navigate(`/doctor/booking?id=${id}`);
  };

  if (isLoading) return <LoadingScreen />;

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
            <Avatar
              size={48}
              source={doctor.image || undefined}
              initials={
                (doctor.firstName?.[0] || "") + (doctor.lastName?.[0] || "")
              }
            />
            <View style={{ flex: 1 }}>
              <TextSemiBold
                style={{ fontSize: 20, color: "#000", textAlign: "left" }}
              >
                Dr. {doctor.firstName} {doctor.lastName}
              </TextSemiBold>
            </View>
          </View>

          <Specializations doctor={doctor} />
        </View>

        {/* Time zone */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <CustomIcon name="directions-boat" size={20} color="#000" />
          <View style={{ flexDirection: "column", gap: 8 }}>
            <TextSemiBold
              style={{ fontSize: 16, color: "#000", textAlign: "left" }}
            >
              {t("common.time-zone")}
            </TextSemiBold>
            <TextRegular
              style={{
                fontSize: 16,
                color: Colors.light.grey,
                textAlign: "left",
              }}
            >
              {t("doctor.time-zone-description", {
                lastName: doctor.lastName,
                timeZone: doctor.timeZone,
              })}
            </TextRegular>
          </View>
        </View>

        {/* Languages */}
        <View
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}
        >
          <Ionicons name="language" size={20} color="#000" />
          <View style={{ flexDirection: "column", gap: 8 }}>
            <TextSemiBold
              style={{ fontSize: 16, color: "#000", textAlign: "left" }}
            >
              {t("common.languages")}
            </TextSemiBold>
            <TextRegular
              style={{
                fontSize: 16,
                color: Colors.light.grey,
                textAlign: "left",
              }}
            >
              {t("doctor.doctor-speaks", {
                firstName: doctor.firstName,
                languages: doctor.languages
                  ?.map(
                    (code) =>
                      getLanguageOptions(t).find((opt) => opt.value === code)
                        ?.label || code
                  )
                  .join(t("common.list-separator")),
              })}
            </TextRegular>
          </View>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}
        >
          <CustomIcon name="briefcase" size={20} color="#000" />
          <View style={{ flexDirection: "column", gap: 8 }}>
            <TextSemiBold
              style={{ fontSize: 16, color: "#000", textAlign: "left" }}
            >
              {t("common.experience")}
            </TextSemiBold>
            <TextRegular
              style={{
                fontSize: 16,
                color: Colors.light.grey,
                textAlign: "left",
              }}
            >
              {t("doctor.experience-description", {
                lastName: doctor.lastName,
                count: Number(doctor.experience),
              })}
            </TextRegular>
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
          <TextRegular
            style={{ fontSize: 14, color: Colors.lightText, textAlign: "left" }}
          >
            {t("common.consultation-price")}
          </TextRegular>
          <TextSemiBold
            style={{ fontSize: 20, color: Colors.black, textAlign: "left" }}
          >
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
            {t("comon.book")}
          </TextSemiBold>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Page;
