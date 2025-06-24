import PageListLink from "@/components/PageListLink";
import PageScrollView from "@/components/PageScrollView";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform } from "react-native";
import * as Linking from "expo-linking";

const Settings = () => {
  const { t } = useTranslation();

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Alert.alert(
        t("alert.language-ios-title"),
        t("alert.language-ios-instructions"),
        [
          {
            text: t("common.cancel"),
            style: "cancel",
          },
          {
            text: t("common.continue"),
            onPress: () => Linking.openURL("app-settings:"),
          },
        ]
      );
    } else if (Platform.OS === "android") {
      Alert.alert(
        t("alert.language-android-title"),
        t("alert.language-android-instructions"),
        [
          {
            text: t("common.cancel"),
            style: "cancel",
          },
          {
            text: t("common.continue"),
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };

  return (
    <PageScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
      <PageListLink
        key={"language"}
        title={t("settings.set-language")}
        description={t("settings.change-your-drx-telehealth-app-language")}
        onPress={openAppSettings}
      />
    </PageScrollView>
  );
};

export default Settings;
