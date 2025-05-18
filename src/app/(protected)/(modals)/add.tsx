import PageScrollView from "@/components/PageScrollView";
import RegularTextInput from "@/components/RegularTextInput";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Hook to track keyboard height using reanimated shared value
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

// Add takes in options to set up the form
const AddOptions = {
  title: "Add Medication",
  description: "Add a new medication to your record.",
};

const Add = () => {
  const [medicationName, setMedicationName] = React.useState("");
  const [dosage, setDosage] = React.useState("");
  const [frequency, setFrequency] = React.useState("");
  const [unit, setUnit] = React.useState("day");

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
        <View style={styles.frequencyContainer}>
          <View style={styles.frequencyRow}>
            <RegularTextInput
              value={frequency}
              label="Frequency"
              keyboardType="numeric"
              onChangeText={setFrequency}
              placeholder="2"
            />
            <TextRegular style={styles.timesPer}>times per</TextRegular>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={unit}
                onValueChange={(itemValue) => setUnit(itemValue)}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Day" value="day" />
                <Picker.Item label="Week" value="week" />
                <Picker.Item label="Year" value="year" />
              </Picker>
            </View>
          </View>
        </View>
      </PageScrollView>

      <Footer keyboardHeightShared={height} />

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
  frequencyContainer: {},
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  frequencyInput: {
    flex: 1,
    marginRight: 8,
  },
  timesPer: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  dropdownWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
});

const Footer = ({
  keyboardHeightShared,
}: {
  keyboardHeightShared: SharedValue<number>;
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
      <TouchableOpacity style={footer.button}>
        <TextSemiBold style={footer.text}>Save</TextSemiBold>
      </TouchableOpacity>
    </Animated.View>
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
