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
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          marginHorizontal: 16,
        }}
      >
        <View></View>
        <View
          style={[
            themeBorderStyle,
            { flexDirection: "column", padding: 16, gap: 16, borderRadius: 16 },
          ]}
        >
          {/* User name and role */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <Image source={{ uri: user.profileImage }} style={styles.image} />
            <View style={{ flexDirection: "column" }}>
              <Text
                style={[
                  themeTextStylePrimary,
                  { fontFamily: "dm-sb", fontSize: 20 },
                ]}
              >
                {user.name}
              </Text>
              <Text
                style={{
                  fontFamily: "dm-sb",
                  fontSize: 20,
                  color: Colors.primary,
                }}
              >
                {user.role}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View
            style={[themeBorderStyle, { borderWidth: 0, borderBottomWidth: 1 }]}
          />

          {/* Metrics */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Gender */}
            <View>
              <Text
                style={[
                  themeTextStyleSecondary,
                  { fontFamily: "dm", fontSize: 14 },
                ]}
              >
                Gender
              </Text>
              <Text
                style={[
                  themeTextStylePrimary,
                  { fontFamily: "dm-sb", fontSize: 20 },
                ]}
              >
                {user.gender}
              </Text>
            </View>
            {/* Age */}
            <View>
              <Text
                style={[
                  themeTextStyleSecondary,
                  { fontFamily: "dm", fontSize: 14 },
                ]}
              >
                Age
              </Text>
              <Text
                style={[
                  themeTextStylePrimary,
                  { fontFamily: "dm-sb", fontSize: 20 },
                ]}
              >
                {user.age}
              </Text>
            </View>

            {/* Weight */}
            <View>
              <Text
                style={[
                  themeTextStyleSecondary,
                  { fontFamily: "dm", fontSize: 14 },
                ]}
              >
                Weight
              </Text>
              <Text
                style={[
                  themeTextStylePrimary,
                  { fontFamily: "dm-sb", fontSize: 20 },
                ]}
              >
                {user.weight.value} {user.weight.unit}
              </Text>
            </View>

            {/* Height */}
            <View>
              <Text
                style={[
                  themeTextStyleSecondary,
                  { fontFamily: "dm", fontSize: 14 },
                ]}
              >
                Height
              </Text>
              <Text
                style={[
                  themeTextStylePrimary,
                  { fontFamily: "dm-sb", fontSize: 20 },
                ]}
              >
                {user.height.value} {user.height.unit}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
