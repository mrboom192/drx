import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { SafeAreaView } from "@/components/Themed";
import Colors from "@/constants/Colors";

const Page = () => {
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
      <View style={styles.container}>
        {/* Card */}
        <View
          style={{
            flexDirection: "column",
            backgroundColor: Colors.primary,
            borderRadius: 16,
            padding: 16,
            margin: 16,
            gap: 14,
          }}
        >
          <Text
            style={[
              themeTextStylePrimary,
              { fontFamily: "dm-sb", fontSize: 20 },
            ]}
          >
            Online Consultations
          </Text>

          {/* Description */}
          <Text
            style={[themeTextStylePrimary, { fontFamily: "dm", fontSize: 16 }]}
          >
            Find specialist doctors who can consult, diagnose, and prescribe
          </Text>

          {/* Inner Button */}
          <Link href={`/(app)/(tabs)/doctors/search`} asChild>
            <TouchableOpacity
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: "#FFF",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  themeTextStylePrimary,
                  { textAlign: "center", fontFamily: "dm-sb", fontSize: 16 },
                ]}
              >
                Search
              </Text>
            </TouchableOpacity>
          </Link>
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

export default Page;
