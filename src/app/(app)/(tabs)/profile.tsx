import { View, StyleSheet, Text, SafeAreaView, Image } from "react-native";
import React, { useMemo } from "react";
import { Stack } from "expo-router";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import userData from "@/../assets/data/user.json";
import { User } from "@/types/user";
import Colors from "@/constants/Colors";

const Profile = () => {
  const user = useMemo(() => userData as User, []);
  const {
    colorScheme,
    themeBorderStyle,
    themeTextStylePrimary,
    themeTextStyleSecondary,
  } = useThemedStyles();

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
      <View style={styles.container}>
        <View
          style={[
            themeBorderStyle,
            { flexDirection: "column", padding: 16, gap: 16, borderRadius: 16 },
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <Image source={{ uri: user.profileImage }} style={styles.image} />
            <View style={{ flexDirection: "column" }}>
              <Text
                style={[
                  themeTextStylePrimary,
                  { fontFamily: "dm-sb", fontSize: 16 },
                ]}
              >
                {user.name}
              </Text>
              <Text
                style={{
                  fontFamily: "dm-sb",
                  fontSize: 16,
                  color: Colors.primary,
                }}
              >
                {user.role}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 16,
  },
  filterBtn: {
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    gap: 10,
    flex: 1,
    padding: 14,
    borderRadius: 30,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 9999,
  },
});

export default Profile;
