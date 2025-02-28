import { Text, Pressable, View, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

interface NavigateButtonProps {
  title?: string;
  rightIcon?: React.ReactNode; // Optional icon to display in the button
  leftIcon?: React.ReactNode; // Optional icon to display in the button
  handleSubmit?: () => void;
  theme?: "dark" | "light" | "transparent"; // Theme for the button
  href: any;
}

const NavigateButton: React.FC<NavigateButtonProps> = ({
  title = "Next",
  leftIcon,
  rightIcon,
  handleSubmit,
  theme = "dark", // Default theme is dark
  href,
}) => {
  // Dynamic styles based on the theme
  const isDarkTheme = theme === "dark";
  const isLightTheme = theme === "light";

  return (
    <Link href={href} asChild>
      <TouchableOpacity
        className={`rounded-lg overflow-hidden py-4 px-6 justify-center flex-row items-center gap-2
  ${isDarkTheme ? "bg-[#2C2C2C]" : isLightTheme ? "bg-white" : ""}`}
        accessibilityLabel={title}
        onPress={handleSubmit}
      >
        {leftIcon}
        <Text
          className={`capitalize font-semibold ${
            isDarkTheme
              ? "text-white"
              : isLightTheme
              ? "text-black"
              : "text-gray-800"
          }`}
        >
          {title}
        </Text>
        {rightIcon}
      </TouchableOpacity>
    </Link>
  );
};

export default NavigateButton;
