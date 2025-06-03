import Colors from "@/constants/Colors";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { useUserData } from "@/stores/useUserStore";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import IconButton from "./IconButton";
import { TextRegular, TextSemiBold } from "./StyledText";
import UserAvatar from "./UserAvatar";

const UserRow = () => {
  const userData = useUserData();

  if (!userData) {
    return null;
  }

  return (
    <View
      style={{
        paddingHorizontal: 16,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <WelcomeMessage
        name={userData.firstName + " " + userData.lastName}
        role={userData.role}
      />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <IconButton
          name={"notification-bell"}
          onPress={() => {
            router.navigate("/(protected)/notifications");
          }}
        />
        <UserAvatar size={40} canUpload={false} />
      </View>
    </View>
  );
};

const WelcomeMessage = ({ name, role }: { name: string; role: string }) => {
  const { themeTextStyleSecondary } = useThemedStyles();
  const color = role === "patient" ? Colors.primary : Colors.gold;

  return (
    <View>
      <TextRegular
        style={[
          themeTextStyleSecondary,
          {
            fontSize: 14,
          },
        ]}
      >
        Welcome back,
      </TextRegular>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TextSemiBold style={{ fontSize: 20 }}>{name}</TextSemiBold>
        <TextSemiBold
          style={{
            fontSize: 12,
            color,
          }}
        >
          {role}
        </TextSemiBold>
      </View>
    </View>
  );
};

export default UserRow;
