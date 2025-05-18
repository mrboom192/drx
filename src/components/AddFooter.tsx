import Colors from "@/constants/Colors";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextSemiBold } from "./StyledText";

const Footer = ({
  keyboardHeightShared,
  canSubmit,
  handleSubmit,
  submitting,
}: {
  keyboardHeightShared: SharedValue<number>;
  canSubmit: boolean;
  submitting: boolean;
  handleSubmit?: () => void;
}) => {
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    const basePadding = 16;
    const safeAreaBottom = insets.bottom;

    // Smoothly interpolate between full padding and minimal when keyboard shows
    const paddingBottom = interpolate(
      keyboardHeightShared.value,
      [0, 350], // Find another way instead of hardcoding 350
      [basePadding + safeAreaBottom, basePadding]
    );

    return {
      paddingBottom,
    };
  }, [insets.bottom]);

  return (
    <Animated.View style={[footer.container, animatedStyle]}>
      <TouchableOpacity
        style={[footer.button, { opacity: canSubmit && !submitting ? 1 : 0.5 }]}
        disabled={!canSubmit || submitting}
        onPress={() => {
          if (canSubmit && !submitting) {
            handleSubmit?.();
          }
        }}
      >
        <TextSemiBold style={footer.text}>Save</TextSemiBold>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Footer;

const footer = StyleSheet.create({
  container: {
    padding: 16,
    borderTopColor: Colors.faintGrey,
    borderTopWidth: 1,
  },
  button: {
    borderColor: Colors.dark.background,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
});
