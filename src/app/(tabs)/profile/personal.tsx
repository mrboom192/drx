import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/contexts/UserContext";

const Personal = () => {
  const router = useRouter();
  const { data } = useUser();

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
        {/* Account Info */}
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

        {/* Public Profile */}
        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)/profile/public-profile");
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

        {/* Doctor verification */}
        {data.role === "doctor" && (
          <TouchableOpacity
            onPress={() => {
              router.push("/(tabs)/profile/doctor-verification");
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
                <View
                  style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
                >
                  <Text
                    style={{ fontFamily: "dm-sb", fontSize: 16, color: "#000" }}
                  >
                    Doctor verification
                  </Text>

                  {(data.verification === "unverified" ||
                    !data.verification) && (
                    <Ionicons
                      name="alert-circle-outline"
                      size={20}
                      color={Colors.pink}
                    />
                  )}
                  {data.verification === "pending" && (
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={Colors.onlineConsultation}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: "dm",
                    fontSize: 14,
                    color: "#555",
                    marginTop: 2,
                  }}
                >
                  Verify your doctor account in order for you to be visible to
                  patients
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#000" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Personal;
