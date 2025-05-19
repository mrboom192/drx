import { Dimensions } from "react-native";

export const getDayWidth = () => {
  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = 32;
  const totalGapBetweenDays = 6 * 4; // 6 gaps between 7 days
  const availableWidth = screenWidth - horizontalPadding - totalGapBetweenDays;
  return availableWidth / 7;
};

export const getDayHeight = (calendarHeight: number) => {
  const verticalPadding = 32; // e.g., 16 top + 16 bottom
  const totalGapBetweenRows = 4 * 4; // 4 gaps between 5 rows
  const availableHeight =
    calendarHeight - verticalPadding - totalGapBetweenRows - 120;
  return availableHeight / 5;
};
