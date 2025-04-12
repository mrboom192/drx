import { View, Text } from "react-native";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import Colors from "@/constants/Colors";
import Avatar from "./Avatar";

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
      <Text
        style={[
          themeTextStyleSecondary,
          {
            fontFamily: "dm",
            fontSize: 14,
          },
        ]}
      >
        Welcome back,
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ fontFamily: "dm-sb", fontSize: 20 }}>{name}</Text>
        <Text
          style={{
            fontFamily: "dm-sb",
            fontSize: 12,
            color,
          }}
        >
          {role}
        </Text>
      </View>
    </View>
  );
};

export default UserRow;
