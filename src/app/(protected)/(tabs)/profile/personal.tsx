import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUserData } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const Personal = () => {
  const router = useRouter();
  const userData = useUserData();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
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
        {userData?.role === "doctor" && (
          <>
            {/* Public Profile */}
            <TouchableOpacity
              onPress={() => {
                router.navigate("/(protected)/(modals)/update-public-profile");
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
                    {!userData.hasPublicProfile && (
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
                router.push({
                  pathname: "/(protected)/(modals)/doctor-verification",
                });
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

                    {(userData.verification === "unverified" ||
                      !userData.verification) && (
                      <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color={Colors.pink}
                      />
                    )}
                    {userData.verification === "pending" && (
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={Colors.onlineConsultation}
                      />
                    )}
                    {userData.verification === "verified" && (
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
    </View>
  );
};

export default Personal;
