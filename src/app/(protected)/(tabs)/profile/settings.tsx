import PageListLink from "@/components/PageListLink";
import PageScrollView from "@/components/PageScrollView";
import { RelativePathString } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import * as Linking from "expo-linking";

const Settings = () => {
  const { t } = useTranslation();

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else if (Platform.OS === "android") {
      Linking.openSettings();
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
