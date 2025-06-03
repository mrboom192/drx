import CustomIcon from "@/components/icons/CustomIcon";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { countries } from "@/constants/countries";
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

type Item = {
  name: string;
  image: ImageSourcePropType;
  params: { countries: string[] };
  backgroundColor: string;
};

const InternationalDoctors = ({}: {}) => {
  const onPress = (params: { countries: string[] }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const query = new URLSearchParams();
    if (params.countries) {
      query.append("countries", params.countries.join(","));
    }

    router.navigate({
      pathname: `/search`,
      params: Object.fromEntries(query.entries()),
    });
  };

  return (
    <View style={styles.container}>
      <TextSemiBold style={styles.header}>Go international</TextSemiBold>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {countries.map((item: Item, index: number) => (
          <TouchableOpacity
            onPress={() => onPress(item.params)}
            key={index}
            style={styles.item}
          >
            <View
              style={[
                styles.countryImage,
                { backgroundColor: item.backgroundColor },
              ]}
            >
              <Image
                style={styles.image}
                source={item.image}
                contentFit="contain"
                transition={250}
              />
            </View>
            <View style={styles.bottomText}>
              <TextSemiBold style={styles.text}>{item.name}</TextSemiBold>
              <CustomIcon name="arrow-forward" size={20} color="#000" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default InternationalDoctors;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    paddingBottom: 12,
    borderBottomColor: Colors.faintGrey,
    borderBottomWidth: 1,
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
    justifyContent: "space-between",
    height: 130,
    width: 175,
  },
  countryImage: {
    width: "100%",
    height: 105,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  bottomText: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
});
