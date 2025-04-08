import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { Link, RelativePathString, Stack } from "expo-router";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import UserAvatar from "@/components/UserAvatar";
import { PathString } from "react-hook-form";

const items = [
  {
    icon: "person-outline",
    label: "Manage your personal information",
    url: "/(tabs)/profile/personal",
  },
  {
    icon: "medkit-outline",
    label: "View your medical records",
    url: "/(tabs)/profile",
  },
  {
    icon: "cloud-upload-outline",
    label: "Manage uploaded images and files",
    url: "/(tabs)/profile",
  },
  {
    icon: "call-outline",
    label: "Contact customer support",
    url: "/(tabs)/profile",
  },
  {
    icon: "notifications-outline",
    label: "Notifications",
    url: "/(tabs)/profile",
  },
  {
    icon: "shield-checkmark-outline",
    label: "View privacy policy and terms of service",
    url: "/(tabs)/profile",
  },
];

const Profile = () => {
  const { colorScheme } = useThemedStyles();
  const { signOut } = useSession();
  const { data, loading } = useUser();

  if (loading) {
    return <Text>Loading...</Text>;
  }

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
            marginVertical: 16,

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
          <UserAvatar size={64} canUpload={true} />
          <View>
            <Text style={{ fontFamily: "dm-sb", fontSize: 20 }}>
              {data.firstName + " " + data.lastName}
            </Text>
            <Text
              style={{ fontFamily: "dm", fontSize: 16, color: Colors.primary }}
            >
              {data.role ? data.role : "Role not found"}
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
                <Link key={idx} href={item.url as RelativePathString} asChild>
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
