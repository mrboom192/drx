import { Path, Svg } from "react-native-svg";
import { IconName, icons } from "./iconsMap";

const DEFAULT_SIZE = 24;
const DEFAULT_COLOR = "#000";

const CustomIcon = ({
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  name,
}: {
  size?: number;
  color?: string;
  name: IconName;
}) => {
  const icon = icons[name];
  if (!icon) return null;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d={icon.d} />
    </Svg>
  );
};

export default CustomIcon;
