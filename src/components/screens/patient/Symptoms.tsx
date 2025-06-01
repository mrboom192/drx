import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const symptoms = [
  {
    name: "Diarrhea",
    image: require("@/../assets/images/symptoms/diarrhea.png"),
  },
  {
    name: "Acne",
    image: require("@/../assets/images/symptoms/acne.png"),
  },
  {
    name: "Heart",
    image: require("@/../assets/images/symptoms/heart.png"),
  },
  {
    name: "Allergies",
    image: require("@/../assets/images/symptoms/allergies.png"),
  },
  {
    name: "Depression",
    image: require("@/../assets/images/symptoms/depression.png"),
  },

  {
    name: "UTI",
    image: require("@/../assets/images/symptoms/uti.png"),
  },
];

type TabItem = {
  name: string;
  image: any; // or use ImageSourcePropType if available
};

const Symptoms = ({}: {}) => {
  const selectCategory = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Redirect here
  };

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <View style={styles.container}>
      <TextSemiBold style={styles.header}>What can we help with?</TextSemiBold>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {symptoms.map((item: TabItem, index: number) => (
          <View key={index} style={styles.item}>
            <Image
              style={styles.image}
              source={item.image}
              contentFit="cover"
              transition={1000}
            />
            <TextSemiBold style={styles.text}>{item.name}</TextSemiBold>
          </View>
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
