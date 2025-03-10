import React from "react";
import { Svg, Path } from "react-native-svg";

const Bookmark = ({ size = 18, color }: { size: number; color: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M5 21V5C5 4.45 5.19583 3.97917 5.5875 3.5875C5.97917 3.19583 6.45 3 7 3H17C17.55 3 18.0208 3.19583 18.4125 3.5875C18.8042 3.97917 19 4.45 19 5V21L12 18L5 21Z" />
    </Svg>
  );
};

export default Bookmark;
