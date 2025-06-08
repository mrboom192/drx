import { Day, Locale, Month } from "date-fns";
import { TFunction } from "i18next";
import { Dimensions } from "react-native";

export const getMonthNames = (
  locale: Locale,
  type: "wide" | "abbreviated" = "wide"
): string[] => {
  const months: string[] = [];
  for (let i = 0; i < 12; i++) {
    months.push(locale.localize?.month(i as Month, { width: type }));
  }
  return months;
};

export const getDayNames = (
  locale: Locale,
  type: "wide" | "abbreviated" = "wide"
): string[] => {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(locale.localize?.day(i as Day, { width: type }));
  }
  return days;
};

export const getLocaleData = (
  locale: Locale,
  t: TFunction<"translation", undefined>
) => {
  return {
    monthNames: getMonthNames(locale),
    monthNamesShort: getMonthNames(locale, "abbreviated"),
    dayNames: getDayNames(locale),
    dayNamesShort: getDayNames(locale, "abbreviated"),
    today: t("calendar.today"),
  };
};

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
