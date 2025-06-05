import CustomIcon from "@/components/CustomIcon";
import { IconName } from "@/constants/iconsMap";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { Href, router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const actions: Item[] = [
  {
    name: "Find a provider",
    description: "Browse and choose the perfect doctor",
    icon: "stethoscope",
    href: "/search" as Href,
  },
  {
    name: "Update your medical record",
    description: "An up-to-date record is recommended",
    icon: "ecg-heart",
    href: "/(tabs)/profile/medical-record" as Href,
  },
  {
    name: "View your cases",
    description: "Browse your pending cases",
    icon: "library-books",
    href: "/search" as Href,
  },
];

type Item = {
  name: string;
  description: string;
  icon: string;
  href: Href;
};

const PatientActions = ({}: {}) => {
  const onPress = (href: Href) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Redirect here
    router.navigate(href, { withAnchor: true });
  };

  return (
    <View style={styles.container}>
      <TextSemiBold style={styles.header}>Patient actions</TextSemiBold>
      {actions.map((item: Item, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => onPress(item.href)}
          style={styles.action}
        >
          <CustomIcon
            name={item.icon as IconName}
            size={24}
            color={Colors.black}
          />
          <View style={styles.actionRight}>
            <TextSemiBold style={styles.actionName}>{item.name}</TextSemiBold>
            <TextRegular style={styles.actionDescription}>
              {item.description}
            </TextRegular>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PatientActions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
  },
  header: {
    fontSize: 16,
  },
  actionName: {
    fontSize: 14,
    color: Colors.black,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.grey,
  },
  action: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.faintGrey,
  },
  actionRight: {
    flexDirection: "column",
  },
});
