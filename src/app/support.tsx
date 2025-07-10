import PageScrollView from "@/components/PageScrollView";
import { TextRegular } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <PageScrollView
      contentContainerStyle={{
        paddingBottom: insets.bottom + 16,
        paddingHorizontal: 16,
      }}
    >
      <TextRegular style={{ color: Colors.grey }}>
        {t("support.info")}
      </TextRegular>
    </PageScrollView>
  );
}
