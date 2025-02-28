import React from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  color?: string; // Optional color prop with a default value
}

const MiniFlame: React.FC<IconProps> = ({ color = "#F2754E" }) => {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1233 9.50319C10.7342 11.5205 8.66028 13.0201 6.8148 12.9814C5.05932 12.9445 3.24437 11.5211 2.85859 9.50319C2.22449 6.18627 6.96909 4.99479 5.16892 1.12C5.16892 1.12 7.74956 2.25275 8.91378 5.3569C9.32491 5.50229 9.50201 4.39933 8.98721 3.77346C11.0809 5.48931 11.3769 8.18889 11.1233 9.50319Z"
        fill={color}
        stroke={color}
      />
    </Svg>
  );
};

export default MiniFlame;
