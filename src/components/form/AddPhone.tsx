import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { TextRegular, TextSemiBold } from "../StyledText";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { router } from "expo-router";

const AddPhone = () => {
  const { t } = useTranslation();

  const handlePress = useCallback(() => {
    router.navigate("/(protected)/(modals)/add-phone");
  }, []);

  return (
    <View style={styles.container}>
      <TextRegular style={styles.label}>{t("form.phone-number")}</TextRegular>
      <TouchableOpacity onPress={handlePress}>
        <TextSemiBold style={styles.addButton}>Add</TextSemiBold>
      </TouchableOpacity>
    </View>
  );
};

export default AddPhone;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  addButton: {
    fontSize: 14,
    color: Colors.black,
    textDecorationLine: "underline",
  },
});
