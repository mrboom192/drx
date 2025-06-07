import PageScrollView from "@/components/PageScrollView";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import React from "react";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const { t } = useTranslation();

  return (
    <PageScrollView>
      <TextSemiBold
        style={{
          fontSize: 16,
          textAlign: "center",
          color: Colors.grey,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {t("notifications.you-have-no-notifications")}
      </TextSemiBold>
    </PageScrollView>
  );
};

export default Notifications;
