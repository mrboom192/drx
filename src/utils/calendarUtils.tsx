import { Day, Locale, Month } from "date-fns";
import { TFunction } from "i18next";

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

export const getDayWidth = (componentWidth: number) => {
  const horizontalPadding = 32;
  const totalGapBetweenDays = 6 * 4;
  const availableWidth =
    componentWidth - horizontalPadding - totalGapBetweenDays;
  return availableWidth / 7;
};

export const getDayHeight = (componentHeight: number) => {
  const verticalPadding = 32;
  const totalGapBetweenRows = 4 * 4;
  const reservedHeight = 120;
  const availableHeight =
    componentHeight - verticalPadding - totalGapBetweenRows - reservedHeight;
  return availableHeight / 5;
};
