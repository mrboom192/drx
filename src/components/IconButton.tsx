import Colors from "@/constants/Colors";
import React from "react";
import { GestureResponderEvent, TouchableOpacity, View } from "react-native";
import CustomIcon from "./icons/CustomIcon";
import { IconName } from "./icons/iconsMap";

const DEFAULT_ICONBUTTON_SIZE = 40;

const IconButton = ({
  name,
  onPress,
  pointerEvents = "auto",
}: {
  name: IconName;
  onPress?: (event: GestureResponderEvent) => void;
  pointerEvents?: "auto" | "box-none" | "none" | "box-only";
}) => {
  return (
    <View pointerEvents={pointerEvents}>
      <TouchableOpacity
        style={{
          width: DEFAULT_ICONBUTTON_SIZE,
          height: DEFAULT_ICONBUTTON_SIZE,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
          borderWidth: 1,
          borderColor: Colors.lightGrey2,
        }}
        onPress={onPress}
      >
        <CustomIcon name={name} size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default IconButton;
