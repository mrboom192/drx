import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import React from "react";
import { TextSemiBold } from "./StyledText";
import Colors from "@/constants/Colors";

type SubmitButtonProps = {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: "primary" | "secondary";
};

const SubmitButton = ({
  disabled,
  loading,
  text,
  onPress,
  style,
  variant = "primary",
}: SubmitButtonProps) => {
  const variantStyles = variant === "secondary" ? secondary : primary;

  return (
    <TouchableOpacity
      style={[variantStyles.button, style, { opacity: disabled ? 0.5 : 1 }]}
      disabled={disabled}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? Colors.black : "#FFF"}
        />
      ) : (
        <TextSemiBold style={variantStyles.text}>{text}</TextSemiBold>
      )}
    </TouchableOpacity>
  );
};

export default SubmitButton;

const primary = StyleSheet.create({
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

const secondary = StyleSheet.create({
  button: {
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  text: {
    color: Colors.black,
    fontSize: 16,
    textAlign: "center",
  },
});
