import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { Link, Stack } from "expo-router";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import userData from "@/../assets/data/user.json";
import { User } from "@/types/user";
import Colors from "@/constants/Colors";
import Avatar from "@/components/Avatar";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/contexts/AuthContext";

const items = [
  {
    icon: "person-outline",
    label: "Manage your personal information",
  },
  {
    icon: "medkit-outline",
    label: "View your medical records",
  },
  {
    icon: "cloud-upload-outline",
    label: "Manage uploaded images and files",
  },
  {
    icon: "call-outline",
    label: "Contact customer support",
  },
  {
    icon: "notifications-outline",
    label: "Notifications",
  },
  {
    icon: "shield-checkmark-outline",
    label: "View privacy policy and terms of service",
  },
];

const Profile = () => {
  const user = useMemo(() => userData as User, []);
  const { colorScheme } = useThemedStyles();
  const { signOut } = useSession();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === "light"
            ? Colors.light.background
            : Colors.dark.background,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        {/* User Card */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#FFF",
            marginBottom: 16,

            paddingVertical: 32,
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,

            shadowColor: "#000", // ios
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            elevation: 10, // android
          }}
        >
          <Avatar size={64} initials={`${user.name[0]}`} />
          <View>
            <Text style={{ fontFamily: "dm-sb", fontSize: 20 }}>
              {user.name}
            </Text>
            <Text
              style={{ fontFamily: "dm", fontSize: 16, color: Colors.primary }}
            >
              {user.role ? user.role : "Patient"}
            </Text>
          </View>
        </View>

        {/* Main Message */}
        <Text style={{ fontFamily: "dm-sb", fontSize: 20, marginBottom: 16 }}>
          How can we help you, Trevor?
        </Text>

        {/* Links */}
        <View style={{ width: "100%" }}>
          {/* Create rows of two */}
          {Array.from({ length: 3 }).map((_, rowIdx) => (
            <View
              key={rowIdx}
              style={{
                flexDirection: "row",
                gap: 16,
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              {items.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, idx) => (
                // The links themselves
                <Link key={idx} href={"/(tabs)/profile"} asChild>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 16,
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 16,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: Colors.light.faintGrey,
                    }}
                  >
                    <Ionicons
                      name={item.icon as keyof typeof Ionicons.glyphMap}
                      size={24}
                      color={Colors.primary}
                      style={{ marginBottom: 12 }}
                    />
                    <Text style={{ fontSize: 12, color: Colors.light.grey }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          ))}
        </View>

        {/* Logout button */}
        <TouchableOpacity
          onPress={signOut}
          style={{
            marginTop: 24,
            paddingVertical: 12,
            paddingHorizontal: 32,
            backgroundColor: Colors.primary,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontFamily: "dm-sb",
              textAlign: "center",
            }}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
