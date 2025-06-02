import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const symptoms = [
  {
    name: "Diarrhea",
    image: require("@/../assets/images/symptoms/diarrhea.png"),
    params: {
      specializations: ["gastroenterology", "internal", "family"],
    },
  },
  {
    name: "Acne",
    image: require("@/../assets/images/symptoms/acne.png"),
    params: {
      specializations: ["dermatology", "family", "internal"],
    },
  },
  {
    name: "Heart",
    image: require("@/../assets/images/symptoms/heart.png"),
    params: {
      specializations: ["cardiology", "emergency", "internal"],
    },
  },
  {
    name: "Allergies",
    image: require("@/../assets/images/symptoms/allergies.png"),
    params: {
      specializations: ["allergy", "immunology", "pulmonology"],
    },
  },
  {
    name: "Depression",
    image: require("@/../assets/images/symptoms/depression.png"),
    params: {
      specializations: ["psychiatry", "psychology", "family"],
    },
  },
  {
    name: "UTI",
    image: require("@/../assets/images/symptoms/uti.png"),
    params: {
      specializations: ["urology", "family", "internal"],
    },
  },
];

type TabItem = {
  name: string;
  image: ImageSourcePropType;
  params: {
    specializations: string[];
  };
};

const Symptoms = ({}: {}) => {
  const onPress = (item: TabItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const query = new URLSearchParams();
    item.params.specializations.forEach((spec) =>
      query.append("specializations", spec)
    );

    // Navigate with query
    router.navigate({
      pathname: "/search",
      params: {
        query: query.toString(),
      },
    });
  };
  return (
    <View style={styles.container}>
      <TextSemiBold style={styles.header}>What can we help with?</TextSemiBold>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {symptoms.map((item: TabItem, index: number) => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            key={index}
            style={styles.item}
          >
            <Image
              style={styles.image}
              source={item.image}
              contentFit="cover"
              transition={1000}
            />
            <TextSemiBold style={styles.text}>{item.name}</TextSemiBold>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Symptoms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
  },
  header: {
    fontSize: 16,
    marginLeft: 16,
  },
  scrollViewContentContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  item: {
    flexDirection: "column",
    alignItems: "center",
    width: 64,
  },
  image: {
    width: 64,
    height: 64,
  },
  text: {
    fontSize: 10,
    color: "#000",
  },
});
