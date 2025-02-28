import React from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  color?: string; // Optional color prop with a default value
  size?: number; // Optional size prop with a default value
}

const Weight: React.FC<IconProps> = ({ color = "#FFF", size = 16 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6.54667 8H9.45333M15 9.66667V6.33333M1 9.66667V6.33333M11.4533 12C13.0533 12 13.4533 11.1 13.4533 10V6C13.4533 4.9 13.0533 4 11.4533 4C9.85333 4 9.45333 4.9 9.45333 6V10C9.45333 11.1 9.85333 12 11.4533 12ZM4.54667 12C2.94667 12 2.54667 11.1 2.54667 10V6C2.54667 4.9 2.94667 4 4.54667 4C6.14667 4 6.54667 4.9 6.54667 6V10C6.54667 11.1 6.14667 12 4.54667 12Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Weight;
