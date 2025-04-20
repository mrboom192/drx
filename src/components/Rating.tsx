import { View, Text, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { themedStyles } from "@/constants/Styles";
import { TextRegular } from "./StyledText";

interface Props {
  rating: number;
  reviews: number;
}

const Rating = ({ rating, reviews }: Props) => {
  const colorScheme = useColorScheme();

  const themeTextStylePrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : themedStyles.darkTextPrimary;

  const themeTextStyleSecondary =
    colorScheme === "light"
      ? themedStyles.lightTextSecondary
      : themedStyles.darkTextSecondary;

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <FontAwesome key={i} name="star" size={16} color={Colors.yellow} />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <FontAwesome
          key={i}
          name="star-half-empty"
          size={16}
          color={Colors.yellow}
        />
      );
    } else {
      stars.push(
        <FontAwesome key={i} name="star-o" size={16} color={Colors.yellow} />
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        <Text style={[themeTextStylePrimary, { fontFamily: "dm-sb" }]}>
          {rating}
        </Text>
        {stars}
      </View>

      <TextRegular style={[themeTextStyleSecondary]}>
        {reviews} reviews
      </TextRegular>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: 200,
  },
  stars: {
    flexDirection: "row",
    gap: 4,
  },
});

export default Rating;
