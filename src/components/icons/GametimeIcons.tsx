import React from "react";
import BarChartIcon from "./BarChartIcon"; // Adjust the import path as necessary
import GraphArrowIncrease from "./GraphArrowIncrease";
import Home from "./Home";
import RoutinesGroup from "./RoutinesGroup";
import UserOutline from "./UserOutline";

const iconMap = {
  BarChartIcon,
  GraphArrowIncrease,
  Home,
  RoutinesGroup,
  UserOutline,
};

type GametimeIconProps = {
  name: keyof typeof iconMap; // Ensures only valid names are passed
  size?: number;
  color?: string;
};

const GametimeIcons: React.FC<GametimeIconProps> = ({
  name,
  size = 24,
  color = "#000",
}) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" does not exist in GametimeIcons.`);
    return null;
  }
  return <IconComponent size={size} color={color} />;
};

export default GametimeIcons;
