import { Text, Pressable, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

interface IconButtonProps {
  title?: string;
  icon: React.ReactNode;
  handlePress?: () => void;
  href?: any;
  theme?: "dark" | "light"; // Theme for the button
  disabled?: boolean; // Disabled state for the button
}

const IconButton: React.FC<IconButtonProps> = ({
  title = "Next",
  icon,
  theme = "dark", // Default theme is dark
  handlePress,
  href,
  disabled = false, // Default to not disabled
}) => {
  // Dynamic styles based on the theme and disabled state
  const isDarkTheme = theme === "dark";
  const isLightTheme = theme === "light";

  const textStyle = disabled
    ? "text-gray-400" // Disabled text color
    : isDarkTheme
    ? "text-white"
    : isLightTheme
    ? "text-black"
    : "text-gray-800";

  const rippleColor = disabled
    ? "transparent"
    : isDarkTheme
    ? "rgba(255, 255, 255, 0.15)"
    : isLightTheme
    ? "rgba(0, 0, 0, 0.1)"
    : "rgba(0, 0, 0, 0.05)";

  const handleButtonPress = () => {
    if (!disabled && handlePress) {
      handlePress();
    }
  };

  return href ? (
    <View className="w-6 h-6 justify-center flex-row items-center gap-2 rounded-lg overflow-hidden">
      <Link href={href} asChild>
        <Pressable
          android_ripple={{
            color: rippleColor,
            borderless: false,
          }}
          className={`w-6 h-6 justify-center flex-row items-center gap-2 rounded-lg overflow-hidden ${textStyle}`}
          accessibilityLabel={title}
          onPress={handleButtonPress}
          disabled={disabled}
        >
          {icon}
        </Pressable>
      </Link>
    </View>
  ) : (
    <View className="w-6 h-6 justify-center flex-row items-center gap-2 rounded-lg overflow-hidden">
      <Pressable
        android_ripple={{
          color: rippleColor,
          borderless: false,
        }}
        className={`w-6 h-6 justify-center flex-row items-center gap-2 rounded-lg overflow-hidden ${textStyle}`}
        accessibilityLabel={title}
        onPress={handleButtonPress}
        disabled={disabled}
      >
        {icon}
      </Pressable>
    </View>
  );
};

export default IconButton;
