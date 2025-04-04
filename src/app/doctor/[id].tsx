import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Doctor } from "@/types/doctor";
import doctorsData from "@/../assets/data/doctors.json";
import { themedStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const doctor: Doctor | undefined = (doctorsData as any[]).find(
    (item) => item.id === id
  );

  if (!doctor) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>Doctor not found.</Text>
      </View>
    );
  }

  const themeTextPrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : themedStyles.darkTextPrimary;

  const themeTextSecondary =
    colorScheme === "light"
      ? themedStyles.lightTextSecondary
      : themedStyles.darkTextSecondary;

  const SectionHeader = ({
    icon,
    label,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 8,
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color={Colors.primary}
        style={{ marginRight: 8 }}
      />
      <Text
        style={{
          fontFamily: "dm-sb",
          fontSize: 16,
          color: themeTextPrimary.color,
        }}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        flex: 1,
        backgroundColor:
          colorScheme === "light"
            ? Colors.light.background
            : Colors.dark.background,
      }}
    >
      <Stack.Screen options={{ title: "Doctor Profile" }} />
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Image
          source={{
            uri: doctor.photo_url || "https://via.placeholder.com/96",
          }}
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: Colors.light.faintGrey,
          }}
          resizeMode="cover"
        />
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      {/* Name & Specialty */}
      <Text
        style={{
          fontSize: 22,
          fontFamily: "dm-sb",
          marginBottom: 4,
          color: themeTextPrimary.color,
        }}
      >
        {doctor.name}
      </Text>
      {doctor.specialty?.length ? (
        <Text
          style={{
            fontSize: 16,
            color: Colors.light.grey,
            marginBottom: 8,
          }}
        >
          {doctor.specialty.join(", ")}
        </Text>
      ) : null}
      {/* Rating & Experience */}
      {(doctor.rating || doctor.experience_years) && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Ionicons name="star" size={16} color={Colors.yellow} />
          <Text
            style={{
              marginLeft: 6,
              fontSize: 14,
              color: Colors.light.grey,
            }}
          >
            {doctor.rating ? doctor.rating.toFixed(1) : "N/A"} •{" "}
            {doctor.experience_years ?? "?"} yrs experience
          </Text>
        </View>
      )}
      {/* Affiliation */}
      {(doctor.hospital_affiliation || doctor.hospital_address) && (
        <>
          <SectionHeader icon="business-outline" label="Affiliation" />
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: themeTextSecondary.color,
            }}
          >
            {doctor.hospital_affiliation}
            {doctor.hospital_affiliation && doctor.hospital_address ? "\n" : ""}
            {doctor.hospital_address}
          </Text>
        </>
      )}
      {/* About */}
      {doctor.summary && (
        <>
          <SectionHeader icon="information-circle-outline" label="About" />
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: themeTextSecondary.color,
            }}
          >
            {doctor.summary}
          </Text>
        </>
      )}
      {/* Languages */}
      {doctor.languages_spoken?.length > 0 && (
        <>
          <SectionHeader icon="chatbubble-ellipses-outline" label="Languages" />
          <Text
            style={{
              fontSize: 14,
              color: themeTextSecondary.color,
            }}
          >
            {doctor.languages_spoken.join(", ")}
          </Text>
        </>
      )}

      {/* Education */}
      {doctor.education && (
        <>
          <SectionHeader icon="school-outline" label="Education" />
          <Text
            style={{
              fontSize: 14,
              color: themeTextSecondary.color,
            }}
          >
            {JSON.stringify(doctor.education)}
          </Text>
        </>
      )}

      {/* Contact (Phone/Email) */}
      {(doctor.phone || doctor.email) && (
        <>
          <SectionHeader icon="call-outline" label="Contact" />
          {doctor.phone && (
            <Text style={{ fontSize: 14, color: themeTextSecondary.color }}>
              {doctor.phone}
            </Text>
          )}
          {doctor.email && (
            <Text style={{ fontSize: 14, color: themeTextSecondary.color }}>
              {doctor.email}
            </Text>
          )}
        </>
      )}
      {/* Book Button */}
      <TouchableOpacity
        style={{
          marginTop: 32,
          backgroundColor: Colors.primary,
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontFamily: "dm-sb",
          }}
        >
          Book Consultation
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Page;
