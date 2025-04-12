import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Doctor } from "@/types/doctor";
import doctorsData from "@/../assets/data/doctors.json";
import Colors from "@/constants/Colors";
import Avatar from "@/components/Avatar";

const doctor = {
  id: "doc123",
  name: "Melissa Hawkins",
  image: "https://randomuser.me/api/portraits/women/44.jpg",
  specialties: ["Primary care", "Preventative medicine"],
  languages: ["English", "Spanish", "French"],
  experience: 15,
  bio: "Hello, my name is Dr. Melissa Hawkins. I specialize in primary care, focusing on providing comprehensive health services to individuals and families of all ages. With over 15 years of experience, my approach centers around preventive care, managing chronic conditions, and building long-term patient relationships.",
  reviews: [
    {
      name: "Christie",
      text: "Best doctor ever!!!",
      rating: 4.5,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Michael",
      text: "Very knowledgeable and caring.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    },
  ],
  price: 281,
  licenseNumber: "NY1234567",
  licenseState: "NY",
};

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!doctor) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>Doctor not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Stack.Screen
        options={{ title: "Booking", headerTitleAlign: "center" }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Doctor Info */}
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
          }}
        >
          <Avatar size={48} uri={doctor.image} />
          <Text style={{ fontFamily: "dm-sb", fontSize: 20, color: "#000" }}>
            Dr. {doctor.name}
          </Text>
        </View>

        {/* Specializations */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          {doctor.specialties?.map((specialty: string, idx: number) => (
            <View
              key={idx}
              style={{
                backgroundColor: idx === 0 ? "#8EFFC3" : "#E6E6FA",
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "dm",
                  fontSize: 12,
                  color: "#333",
                }}
              >
                {specialty}
              </Text>
            </View>
          ))}
        </View>

        {/* Languages */}
        <View style={{ flexDirection: "column", gap: 8 }}>
          <Text
            style={{
              fontFamily: "dm-sb",
              fontSize: 14,
              color: "#000",
            }}
          >
            🗣️ Languages
          </Text>
          <Text
            style={{
              fontFamily: "dm",
              fontSize: 14,
              color: Colors.light.grey,
            }}
          >
            This doctor speaks {doctor.languages?.join(", ")}.
          </Text>
        </View>

        {/* Experience */}
        <View
          style={{
            flexDirection: "column",
            gap: 8,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <Text
            style={{
              fontFamily: "dm-sb",
              fontSize: 14,
              color: "#000",
            }}
          >
            🏥 Experience
          </Text>
          <Text style={{ fontFamily: "dm", fontSize: 14, color: "#444" }}>
            Dr. {doctor.name.split(" ")[0]} has over {doctor.experience} years
            of experience.
          </Text>
        </View>

        {/* Bio */}
        <View
          style={{
            flexDirection: "column",
            gap: 8,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <Text
            style={{
              fontFamily: "dm",
              fontSize: 14,
              color: "#444",
              marginBottom: 16,
            }}
            numberOfLines={5}
          >
            {doctor.bio}
          </Text>
          <TouchableOpacity style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: "dm-sb",
                fontSize: 14,
                color: "#000",
              }}
            >
              Show more
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reviews */}
        <View
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#eee",
            paddingVertical: 16,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontFamily: "dm-sb", fontSize: 14, marginBottom: 6 }}>
            ⭐ 4.96 · 56 reviews
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: doctor.reviews[0].avatar }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                marginRight: 8,
              }}
            />
            <View>
              <Text style={{ fontFamily: "dm-sb", fontSize: 14 }}>
                {doctor.reviews[0].name}
              </Text>
              <Text style={{ fontFamily: "dm", fontSize: 13 }}>
                {doctor.reviews[0].text}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{ marginTop: 12 }}>
            <Text
              style={{
                fontFamily: "dm-sb",
                fontSize: 14,
                color: "#000",
              }}
            >
              Show all reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* License */}
        <TouchableOpacity
          style={{
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Text style={{ fontFamily: "dm", fontSize: 14, color: "#000" }}>
            View Dr. {doctor.name.split(" ")[0]}'s license
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          flexDirection: "row",
          padding: 16,
          borderTopWidth: 1,
          borderColor: "#eee",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ fontFamily: "dm-sb", fontSize: 16 }}>
          ${doctor.price}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            paddingVertical: 10,
            paddingHorizontal: 24,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontFamily: "dm-sb", color: "#fff", fontSize: 14 }}>
            Book
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Page;
