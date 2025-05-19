import { TouchableOpacity, View } from "react-native";

import { TextRegular, TextSemiBold } from "@/components/StyledText";
import UserAvatar from "@/components/UserAvatar";
import Colors from "@/constants/Colors";
import { doctorLinks, patientLinks } from "@/constants/profileLinks";
import { useSession } from "@/contexts/AuthContext";
import { useUserData } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, RelativePathString } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const { signOut } = useSession();
  const userData = useUserData();
  const isPatient = userData?.role === "patient";

  const color = isPatient ? Colors.primary : Colors.gold;
  const links = isPatient ? patientLinks : doctorLinks;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: insets.top,
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: insets.bottom,
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
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {links.map((item, idx) => (
          // The links themselves
          <Link key={idx} href={item.url as RelativePathString} asChild>
            <TouchableOpacity
              style={{
                width: "47%",
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
              <TextRegular style={{ fontSize: 12, color: Colors.light.grey }}>
                {item.label}
              </TextRegular>
            </TouchableOpacity>
          </Link>
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
  );
};

export default Profile;
