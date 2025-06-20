import PageHeader from "@/components/PageHeader";
import PageScrollView from "@/components/PageScrollView";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
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
  const { t } = useTranslation();
  const [languageFilter, setLanguageFilter] = useState<string[]>(["eng"]);

  const handleLanguageSelect = (abbr: string) => {
    setLanguageFilter(
      (prevFilters) =>
        prevFilters.includes(abbr)
          ? prevFilters.filter((lang) => lang !== abbr) // Remove if already selected
          : [...prevFilters, abbr] // Add if not selected
    );
  };

  return (
    <PageScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
      <TextSemiBold style={{ fontSize: 16, color: "#000", marginBottom: 16 }}>
        {t("form.provider-language")}
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
                  : "#000",
              }}
            >
              {language.name}
            </TextSemiBold>
          </TouchableOpacity>
        ))}
      </View>
    </PageScrollView>
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
