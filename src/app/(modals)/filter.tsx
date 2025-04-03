import { Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { View } from "@/components/Themed";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useThemedStyles } from "@/hooks/useThemeStyles";

// 1:11:09

const languages = [
  {
    abbr: "en",
    name: "English",
    direction: "ltr",
    icon: require("@/../assets/images/flag/GB.jpg"),
  },
  {
    abbr: "ar",
    name: "العربية",
    direction: "rtl",
    icon: require("@/../assets/images/flag/PS.jpg"),
  },
];

const Page = () => {
  const router = useRouter();
  const [languageFilter, setLanguageFilter] = useState<string[]>(["eng"]);
  const { colorScheme, themeTextStylePrimary } = useThemedStyles();

  const handleLanguageSelect = (abbr: string) => {
    setLanguageFilter(
      (prevFilters) =>
        prevFilters.includes(abbr)
          ? prevFilters.filter((lang) => lang !== abbr) // Remove if already selected
          : [...prevFilters, abbr] // Add if not selected
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Filters",
          headerTitleStyle: {
            fontFamily: "dm-sb",
          },
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="close-outline"
                size={24}
                color={colorScheme === "light" ? "#000" : "#FFF"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Text
        style={[themeTextStylePrimary, { fontFamily: "dm-sb", fontSize: 24 }]}
      >
        Provider language
      </Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        {languages.map((language: any) => (
          <TouchableOpacity
            key={language.abbr}
            style={{
              padding: 16,
              flexDirection: "row",
              gap: 16,
              borderWidth: 1,
              borderColor: languageFilter.includes(language.abbr)
                ? Colors.primary
                : colorScheme === "light"
                ? Colors.light.faintGrey
                : Colors.dark.faintGrey,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
            onPress={() => handleLanguageSelect(language.abbr)}
          >
            <Image source={language.icon} style={styles.image} />
            <Text
              style={{
                fontFamily: "dm-sb",
                color: languageFilter.includes(language.abbr)
                  ? Colors.primary
                  : colorScheme === "light"
                  ? "#000"
                  : "#FFF",
              }}
            >
              {language.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
    padding: 26,
  },
  image: {
    width: 64,
    height: 43,
    borderRadius: 16,
  },
});

export default Page;
