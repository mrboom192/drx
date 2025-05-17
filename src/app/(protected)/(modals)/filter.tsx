import IconButton from "@/components/IconButton";
import { TextSemiBold } from "@/components/StyledText";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  const handleLanguageSelect = (abbr: string) => {
    setLanguageFilter(
      (prevFilters) =>
        prevFilters.includes(abbr)
          ? prevFilters.filter((lang) => lang !== abbr) // Remove if already selected
          : [...prevFilters, abbr] // Add if not selected
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: "Filters",
          headerTitleStyle: {
            fontFamily: "DMSans_600SemiBold",
          },
          presentation: "modal",
          headerLeft: () => (
            <IconButton name="close" onPress={() => router.back()} />
          ),
        }}
      />
      <TextSemiBold style={[themeTextStylePrimary, { fontSize: 24 }]}>
        Provider language
      </TextSemiBold>
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
            <TextSemiBold
              style={{
                color: languageFilter.includes(language.abbr)
                  ? Colors.primary
                  : colorScheme === "light"
                  ? "#000"
                  : "#FFF",
              }}
            >
              {language.name}
            </TextSemiBold>
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
