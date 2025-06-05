import Colors from "@/constants/Colors";
import React from "react";
import {
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import CustomIcon from "./CustomIcon";
import { IconName } from "../constants/iconsMap";

const DEFAULT_ICONBUTTON_SIZE = 40;

const IconButton = ({
  name,
  onPress,
  pointerEvents = "auto",
  containerStyle,
  buttonStyle,
  size = DEFAULT_ICONBUTTON_SIZE,
}: {
  name: IconName;
  onPress?: (event: GestureResponderEvent) => void;
  pointerEvents?: "auto" | "box-none" | "none" | "box-only";
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  size?: number;
}) => {
  return (
    <View style={containerStyle} pointerEvents={pointerEvents}>
      <TouchableOpacity
        style={[
          {
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: Colors.lightGrey2,
          },
          buttonStyle,
        ]}
        onPress={onPress}
      >
        <CustomIcon name={name} size={size * 0.6} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default IconButton;
