import { useThemedStyles } from "@/hooks/useThemeStyles";
import { Image } from "react-native";

const Avatar = ({ size, uri }: { size: number; uri: string }) => {
  const { themeBorderStyle } = useThemedStyles();

  return (
    <Image
      source={{ uri: uri }}
      style={[
        themeBorderStyle,
        { width: size, height: size, borderRadius: 9999 },
      ]}
    />
  );
};

export default Avatar;
