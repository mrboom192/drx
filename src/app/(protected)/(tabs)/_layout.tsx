import UserRow from "@/components/UserRow";
import Colors from "@/constants/Colors";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: route.name === "chats" ? "none" : "flex",
          backgroundColor: "#FFF",
          borderColor: Colors.faintGrey,
          borderTopWidth: 1,
          paddingHorizontal: 60,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.lightText,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t("tabs.home"),
          header: () => <UserRow />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: t("tabs.messages"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: t("tabs.profile"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
