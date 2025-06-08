import { TFunction } from "i18next";

export const getDayOptions = (t: TFunction) => [
  { label: t("days.sunday"), value: "sunday" },
  { label: t("days.monday"), value: "monday" },
  { label: t("days.tuesday"), value: "tuesday" },
  { label: t("days.wednesday"), value: "wednesday" },
  { label: t("days.thursday"), value: "thursday" },
  { label: t("days.friday"), value: "friday" },
  { label: t("days.saturday"), value: "saturday" },
];
