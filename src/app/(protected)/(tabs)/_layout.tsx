import Colors from "@/constants/Colors";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: route.name === "chats" ? "none" : "flex",
          backgroundColor: "#FFF",
          borderColor: Colors.faintGrey,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: "Messages",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
