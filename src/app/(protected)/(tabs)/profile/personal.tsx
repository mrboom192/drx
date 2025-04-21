import { View, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/contexts/UserContext";
import { TextRegular, TextSemiBold, TextBold } from "@/components/StyledText";

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
            router.push("/(protected)/(tabs)/profile/account-info");
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
              <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
                Account info
              </TextSemiBold>
              <TextRegular
                style={{
                  fontSize: 14,
                  color: "#555",
                  marginTop: 2,
                }}
              >
                Manage your personal account information
              </TextRegular>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Doctor verification */}
        {data.role === "doctor" && (
          <>
            {/* Public Profile */}
            <TouchableOpacity
              onPress={() => {
                router.push("/(protected)/(tabs)/profile/public-profile");
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
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
                      Public profile
                    </TextSemiBold>
                    {!data.hasPublicProfile && (
                      <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color={Colors.onlineConsultation}
                      />
                    )}
                  </View>
                  <TextRegular
                    style={{
                      fontSize: 14,
                      color: "#555",
                      marginTop: 2,
                    }}
                  >
                    Manage your public-facing profile which will be visible to
                    patients
                  </TextRegular>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#000" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/(protected)/(tabs)/profile/doctor-verification");
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
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
                      Doctor verification
                    </TextSemiBold>

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
                    {data.verification === "verified" && (
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color={Colors.green}
                      />
                    )}
                  </View>
                  <TextRegular
                    style={{
                      fontSize: 14,
                      color: "#555",
                      marginTop: 2,
                    }}
                  >
                    Verify your doctor account in order for you to be visible to
                    patients
                  </TextRegular>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#000" />
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Personal;
