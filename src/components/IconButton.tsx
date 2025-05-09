import Colors from "@/constants/Colors";
import React from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import CustomIcon from "./icons/CustomIcon";
import { IconName } from "./icons/iconsMap";

const IconButton = ({
  name,
  onPress,
}: {
  name: IconName;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
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
  );
};

export default IconButton;
