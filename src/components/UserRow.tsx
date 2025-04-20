import { View, Text } from "react-native";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import Colors from "@/constants/Colors";
import Avatar from "./Avatar";
import { TextRegular, TextSemiBold } from "./StyledText";

const UserRow = () => {
  const { data } = useUser();

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
        name={data.firstName + " " + data.lastName}
        role={data.role}
      />
      <Avatar
        size={40}
        initials={`${data.firstName[0]}${data.lastName[0]}`}
        uri={data.image ? data.image : null}
      />
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
