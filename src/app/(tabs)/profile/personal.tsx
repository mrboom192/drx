import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const Personal = () => {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <Stack.Screen
        options={{
          title: "Personal Info",
        }}
      />
      <View style={{ paddingHorizontal: 20 }}>
        {/* Row 1: Account Info */}
        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)/profile/account-info");
          }}
          style={{
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{ fontFamily: "dm-sb", fontSize: 16, color: "#000" }}
              >
                Account info
              </Text>
              <Text
                style={{
                  fontFamily: "dm",
                  fontSize: 14,
                  color: "#555",
                  marginTop: 2,
                }}
              >
                Manage your personal account information
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Row 2: Public Profile */}
        <TouchableOpacity
          onPress={() => {
            router.push("/public-profile");
          }}
          style={{
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{ fontFamily: "dm-sb", fontSize: 16, color: "#000" }}
              >
                Public profile
              </Text>
              <Text
                style={{
                  fontFamily: "dm",
                  fontSize: 14,
                  color: "#555",
                  marginTop: 2,
                }}
              >
                Set up your public profile which will be visible to patients
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Personal;
