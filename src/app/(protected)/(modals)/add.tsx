import PageScrollView from "@/components/PageScrollView";
import RegularTextInput from "@/components/RegularTextInput";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (event) => {
        "worklet";
        height.value = Math.max(event.height, 0);
      },
    },
    []
  );
  return { height };
};

const Add = () => {
  const [medicationName, setMedicationName] = React.useState("");
  const [dosage, setDosage] = React.useState("");
  const { height } = useGradualAnimation();

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
    };
  }, []);

  return (
    <View style={styles.container}>
      <PageScrollView>
        <RegularTextInput
          label="Medication Name"
          value={medicationName}
          onChangeText={setMedicationName}
          placeholder="e.g. Atorvastatin"
        />
        <RegularTextInput
          label="Dosage"
          value={dosage}
          onChangeText={setDosage}
          placeholder="e.g. 10mg pill"
        />
      </PageScrollView>
      <Footer />
      <Animated.View style={fakeView} />
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

const Footer = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[footer.container, { paddingBottom: insets.bottom + 16 }]}>
      <TouchableOpacity style={footer.button}>
        <TextSemiBold style={footer.text}>Save</TextSemiBold>
      </TouchableOpacity>
    </View>
  );
};

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
