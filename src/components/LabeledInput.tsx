import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";

interface LabeledInputProps extends TextInputProps {
  label?: string;
  note?: string;
  labelRight?: React.ReactNode; // Optional content to display next to the label
  iconLeft?: React.ReactNode; // Optional icon to display in the input
  secureTextEntry?: boolean;
  error?: string | undefined; // Error message
  success?: string | undefined; // Success message
  unit?: string;
  containerStyle?: ViewStyle; // Custom style for the container
  labelStyle?: TextStyle; // Custom style for the label
  inputStyle?: TextStyle; // Custom style for the TextInput
  inputContainerStyle?: ViewStyle; // Custom style for the input container
  theme?: "light" | "dark"; // Theme prop to toggle between light and dark mode
  multiline?: boolean; // Whether the input supports multiple lines
  numberOfLines?: number; // Number of visible lines for multiline input
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  iconLeft,
  placeholder = "Enter text",
  onChangeText,
  labelRight,
  label,
  note,
  value,
  error,
  success,
  unit,
  containerStyle,
  labelStyle,
  inputStyle,
  inputContainerStyle,
  theme = "light", // Default theme is light
  multiline = false, // Default single-line input
  numberOfLines = 1, // Default to 1 line for single-line input
  ...inputProps
}) => {
  const isDarkTheme = theme === "dark";

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label Section */}
      {label ? (
        <View style={styles.labelContainer}>
          <View style={styles.labelRow}>
            <Text
              style={[
                styles.label,
                labelStyle,
                isDarkTheme && styles.labelDark,
              ]}
            >
              {label}
            </Text>
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}
          </View>
          {labelRight}
        </View>
      ) : null}

      {/* Input Section */}
      <View
        style={[
          styles.inputContainer,
          isDarkTheme && styles.inputContainerDark,
          inputContainerStyle, // Allow custom styles
        ]}
      >
        {iconLeft}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline} // Enable multiline if passed
          numberOfLines={multiline ? numberOfLines : undefined} // Apply numberOfLines only for multiline inputs
          placeholderTextColor={isDarkTheme ? "#A0A0A0" : "#717171"}
          underlineColorAndroid="transparent"
          style={[styles.input, inputStyle, isDarkTheme && styles.inputDark]}
          {...inputProps}
        />
        {unit ? (
          <Text style={[styles.unit, isDarkTheme && styles.unitDark]}>
            {unit}
          </Text>
        ) : null}
      </View>
      {note ? (
        <Text style={[styles.note, isDarkTheme && styles.noteDark]}>
          {note}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    gap: 8,
  },
  label: {
    color: "#4B5563", // Slate-700
    fontSize: 14,
    fontWeight: "500",
  },
  labelDark: {
    color: "#E5E5E5",
  },
  error: {
    color: "#EF4444", // Red-500
    fontSize: 12,
    marginTop: 2,
  },
  success: {
    color: "#10B981", // Green-500
    fontSize: 12,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B8B8B8",
    gap: 8,
  },
  inputContainerDark: {
    backgroundColor: "#2C2C2A",
    borderColor: "#3A3A3A",
  },
  input: {
    flex: 1,
    paddingVertical: 4,
    backgroundColor: "transparent",
    color: "#000000",
    fontSize: 14,
  },
  inputDark: {
    color: "#FFFFFF",
  },
  unit: {
    color: "#717171", // Gray-400
    fontSize: 14,
  },
  unitDark: {
    color: "#A0A0A0",
  },
  note: {
    color: "#817C7C", // Gray-500
    fontSize: 12,
    fontStyle: "italic",
  },
  noteDark: {
    color: "#A0A0A0",
  },
});

export default LabeledInput;
