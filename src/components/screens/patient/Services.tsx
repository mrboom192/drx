import { TextSemiBold } from "@/components/StyledText";
import { getOurServices } from "@/constants/options";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Href, router } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Item = {
  name: string;
  image: ImageSourcePropType;
  buttonText: string;
  backgroundColor: string;
  href: Href;
};

const Services = ({}: {}) => {
  const { t } = useTranslation();
  const services = useMemo(() => getOurServices(t), [t]);
  const onPress = (item: Item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Redirect here
    router.navigate(item.href);
  };

  return (
    <View style={styles.container}>
      <TextSemiBold style={styles.header}>
        {t("home.our-services")}
      </TextSemiBold>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {services.map((item: Item, index: number) => (
          <View key={index} style={styles.item}>
            <View
              style={[
                styles.description,
                { backgroundColor: item.backgroundColor },
              ]}
            >
              <TextSemiBold style={styles.text}>{item.name}</TextSemiBold>
              <TouchableOpacity
                onPress={() => onPress(item)}
                style={styles.button}
              >
                <TextSemiBold style={styles.buttonText}>
                  {item.buttonText}
                </TextSemiBold>
              </TouchableOpacity>
            </View>
            <Image
              style={styles.image}
              source={item.image}
              contentFit="cover"
              transition={250}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Services;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 12,
  },
  header: {
    fontSize: 16,
    marginHorizontal: 16,
  },
  scrollViewContentContainer: {
    minWidth: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  item: {
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "stretch",
    width: 350,
    height: 130,
    backgroundColor: "#f4f4f4",
  },
  description: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: -1, // Hide any seams
    width: "63%",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  image: {
    flex: 1,
    height: "100%",
  },
  text: {
    fontSize: 16,
    color: "#000",
    textAlign: "left",
  },
  buttonText: {
    fontSize: 12,
    color: "#000",
  },
});
