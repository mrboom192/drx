// No changes needed here
import { TFunction } from "i18next";

export const getTabs = (t: TFunction) => [
  { name: t("common.all"), id: "all" },
  { name: t("common.ongoing"), id: "ongoing" },
  { name: t("common.finished"), id: "finished" },
  { name: t("common.pending"), id: "pending" },
];
