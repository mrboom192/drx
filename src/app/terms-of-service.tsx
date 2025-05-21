import PageScrollView from "@/components/PageScrollView";
import { TextSemiBold } from "@/components/StyledText";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <PageScrollView>
      <View style={{ paddingBottom: insets.bottom + 16 }}>
        <TextSemiBold style={{ fontSize: 24, marginBottom: 12 }}>
          Terms of Services
        </TextSemiBold>
      </View>
    </PageScrollView>
  );
}
