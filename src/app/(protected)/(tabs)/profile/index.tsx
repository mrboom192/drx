import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextRegular, TextSemiBold } from "@/components/StyledText";
import UserAvatar from "@/components/UserAvatar";
import Colors from "@/constants/Colors";
import { useSession } from "@/contexts/AuthContext";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { useUserData } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, RelativePathString, Stack } from "expo-router";

const items = [
  {
    icon: "person-outline",
    label: "Manage your personal information",
    url: "/(tabs)/profile/personal",
  },
  {
    icon: "medkit-outline",
    label: "View your medical records",
    url: "/(tabs)/profile/medical-info",
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
  const userData = useUserData();

  const color = userData?.role === "patient" ? Colors.primary : Colors.gold;

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
            <TextSemiBold style={{ fontSize: 20 }}>
              {userData?.firstName + " " + userData?.lastName}
            </TextSemiBold>
            <TextRegular
              style={{
                fontSize: 16,
                color,
              }}
            >
              {userData?.role ? userData?.role : "Role not found"}
            </TextRegular>
          </View>
        </View>

        {/* Main Message */}
        <TextSemiBold style={{ fontSize: 20, marginBottom: 16 }}>
          How can we help you, {userData?.firstName}?
        </TextSemiBold>

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
                      color={color}
                      style={{ marginBottom: 12 }}
                    />
                    <TextRegular
                      style={{ fontSize: 12, color: Colors.light.grey }}
                    >
                      {item.label}
                    </TextRegular>
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
            backgroundColor: color,
            borderRadius: 8,
          }}
        >
          <TextSemiBold
            style={{
              color: "#FFF",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Log out
          </TextSemiBold>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
