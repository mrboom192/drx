import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconProps } from "@/src/types/utils";

const RoutinesGroup: React.FC<IconProps> = ({ size = 20, color = "white" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10.0001 7.76666C10.9917 7.76666 11.8001 6.95833 11.8001 5.96666C11.8001 4.975 10.9917 4.16666 10.0001 4.16666C9.0084 4.16666 8.20006 4.975 8.20006 5.96666C8.20006 6.95833 9.0084 7.76666 10.0001 7.76666Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.6584 15.8333C6.65006 15.8333 7.4584 15.025 7.4584 14.0333C7.4584 13.0417 6.65006 12.2333 5.6584 12.2333C4.66673 12.2333 3.8584 13.0417 3.8584 14.0333C3.8584 15.025 4.6584 15.8333 5.6584 15.8333Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.3417 15.8333C15.3334 15.8333 16.1417 15.025 16.1417 14.0333C16.1417 13.0417 15.3334 12.2333 14.3417 12.2333C13.3501 12.2333 12.5417 13.0417 12.5417 14.0333C12.5417 15.025 13.3501 15.8333 14.3417 15.8333Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default RoutinesGroup;
