import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { useUser } from "@/contexts/UserContext";
import UserAvatar from "@/components/UserAvatar";
import Avatar from "@/components/Avatar";
import Briefcase from "@/components/icons/Briefcase";
import Language from "@/components/icons/Language";

// Need to have security roles to prevent users from creating invalid profile values

const PublicProfile = () => {
  const { data } = useUser();
  const [publicProfile, setPublicProfile] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          title: "Public profile",
          headerTitleStyle: { fontFamily: "dm-sb" },
          headerTitleAlign: "center",
        }}
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
          <UserAvatar size={48} />
          <Text style={{ fontFamily: "dm-sb", fontSize: 20, color: "#000" }}>
            Dr. {data.firstName + " " + data.lastName}
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
          {["primary care", "ER"].map((specialty: string, idx: number) => (
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
        <View
          style={{
            flexDirection: "row",
            gap: 16,
          }}
        >
          <Language size={20} color="#000" />
          <View style={{ flexDirection: "column", gap: 8 }}>
            <Text
              style={{
                fontFamily: "dm-sb",
                fontSize: 14,
                color: "#000",
              }}
            >
              Languages
            </Text>
            <Text style={{ fontFamily: "dm", fontSize: 14, color: "#444" }}>
              This doctor speaks English.
            </Text>
          </View>
        </View>

        {/* Experience */}
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <Briefcase size={20} color="#000" />
          <View style={{ flexDirection: "column", gap: 8 }}>
            <Text
              style={{
                fontFamily: "dm-sb",
                fontSize: 14,
                color: "#000",
              }}
            >
              Experience
            </Text>
            <Text style={{ fontFamily: "dm", fontSize: 14, color: "#444" }}>
              Dr. {data.firstName + " " + data.lastName} has over 15 years of
              experience.
            </Text>
          </View>
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
            Biographhy here
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
            <Avatar size={28} initials={"JN"} />
            <View>
              <Text style={{ fontFamily: "dm-sb", fontSize: 14 }}>Mark</Text>
              <Text style={{ fontFamily: "dm", fontSize: 13 }}>
                Best doctor ever!!!
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
            View Dr. {data.firstName + " " + data.lastName}'s license
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
        <Text style={{ fontFamily: "dm-sb", fontSize: 16 }}>${16}</Text>
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

export default PublicProfile;
