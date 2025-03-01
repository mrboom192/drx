import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

// interface Props {
//   languageFilter: string[];
//   setLanguageFilter: () => void;
// }

//  { languageFilter, setLanguageFilter }: Props

const Page = () => {
  const router = useRouter();
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
    <View style={styles.container}>
      <Text style={{ fontFamily: "dm-sb", fontSize: 24 }}>
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
              borderWidth: languageFilter.includes(language.abbr)
                ? 2
                : StyleSheet.hairlineWidth,
              borderColor: languageFilter.includes(language.abbr)
                ? "#000"
                : "#DDD",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              backgroundColor: languageFilter.includes(language.abbr)
                ? "#F8F8F8"
                : "#FFF",
            }}
            onPress={() => handleLanguageSelect(language.abbr)}
          >
            <Image source={language.icon} style={styles.image} />
            <Text style={{ fontFamily: "dm-sb" }}>{language.name}</Text>
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
    backgroundColor: "#fff",
    padding: 26,
  },
  seperatorView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 30,
  },
  seperator: {
    fontFamily: "mon-sb",
    color: Colors.grey,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  image: {
    width: 64,
    height: 43,
    borderRadius: 16,
  },
});

export default Page;
