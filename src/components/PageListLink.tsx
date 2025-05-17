import Colors from "@/constants/Colors";
import { LinkProps, router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextRegular, TextSemiBold } from "./StyledText";
import CustomIcon from "./icons/CustomIcon";

const PageListLink = ({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: LinkProps["href"];
}) => {
  return (
    <TouchableOpacity
      onPress={() => router.navigate(href)}
      accessibilityRole="button"
      style={styles.container}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <TextSemiBold style={styles.title}>{title}</TextSemiBold>
          <TextRegular style={styles.description}>{description}</TextRegular>
        </View>
        <CustomIcon name="chevron-right" size={24} color="#000" />
      </View>
    </TouchableOpacity>
  );
};

export default PageListLink;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.light.faintGrey,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
});
