import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "@/src/types/utils";

const Home: React.FC<IconProps> = ({ size = 20, color = "#2C2C2C" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 19 21" fill="none">
      <Path
        d="M6.9 19.5V10.5H12.3V19.5M1.5 7.8L9.6 1.5L17.7 7.8V17.7C17.7 18.1774 17.5104 18.6352 17.1728 18.9728C16.8352 19.3104 16.3774 19.5 15.9 19.5H3.3C2.82261 19.5 2.36477 19.3104 2.02721 18.9728C1.68964 18.6352 1.5 18.1774 1.5 17.7V7.8Z"
        stroke={color} // Use color prop here
        strokeWidth="1.5" // Correct prop casing
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Home;
