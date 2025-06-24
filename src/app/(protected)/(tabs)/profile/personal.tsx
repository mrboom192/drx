import CustomIcon from "@/components/CustomIcon";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUserData } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, TouchableOpacity, View } from "react-native";

const Personal = () => {
  const { t } = useTranslation();
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
            router.navigate("/(protected)/(tabs)/profile/account-info");
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
              <TextSemiBold
                style={{ fontSize: 16, color: "#000", textAlign: "left" }}
              >
                {t("page.account-info")}
              </TextSemiBold>
              <TextRegular
                style={{
                  fontSize: 14,
                  color: "#555",
                  marginTop: 2,
                  textAlign: "left",
                }}
              >
                {t("page.manage-your-personal-account-information")}
              </TextRegular>
            </View>
            <Ionicons
              name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
              size={16}
              color="#000"
            />
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
                <View style={{ flexShrink: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
                      {t("page.public-profile")}
                    </TextSemiBold>
                    {userData.hasPublicProfile ? (
                      <CustomIcon
                        name="check-circle"
                        color={Colors.green}
                        size={20}
                      />
                    ) : (
                      <CustomIcon
                        name="schedule"
                        color={Colors.onlineConsultation}
                        size={20}
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
                    {t(
                      "page.manage-your-public-facing-profile-which-will-be-visible-to-patients"
                    )}
                  </TextRegular>
                </View>
                <Ionicons
                  name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                  size={16}
                  color="#000"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.navigate({
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
                <View style={{ flexShrink: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
                      {t("page.doctor-verification")}
                    </TextSemiBold>

                    {(userData.verification === "unverified" ||
                      !userData.verification) && (
                      <CustomIcon name="error" color={Colors.pink} size={20} />
                    )}
                    {userData.verification === "pending" && (
                      <CustomIcon
                        name="schedule"
                        color={Colors.onlineConsultation}
                        size={20}
                      />
                    )}
                    {userData.verification === "verified" && (
                      <CustomIcon
                        name="check-circle"
                        color={Colors.green}
                        size={20}
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
                    {t(
                      "page.verify-your-doctor-account-in-order-for-you-to-be-visible-to-patients"
                    )}
                  </TextRegular>
                </View>
                <Ionicons
                  name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                  size={16}
                  color="#000"
                />
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default Personal;
