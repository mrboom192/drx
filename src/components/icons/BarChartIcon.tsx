import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconProps } from "@/src/types/utils";

const BarChartIcon: React.FC<IconProps> = ({ size = 18, color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Path
        d="M1 17V14.3333M9 17V7.66667M17 17V1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BarChartIcon;
