import { TFunction } from "i18next";

export const getSearchFilters = (t: TFunction) => [
  {
    name: t("common.all"),
    icon: "user",
  },
  {
    name: t("specializations.general-practice"),
    icon: "stethoscope",
  },
  {
    name: t("specializations.pediatrics"),
    icon: "child_care",
  },
  {
    name: t("specializations.cardiology"),
    icon: "favorite",
  },
  {
    name: t("specializations.dermatology"),
    icon: "healing",
  },
  {
    name: t("specializations.oncology"),
    icon: "coronavirus",
  },
  {
    name: t("specializations.neurology"),
    icon: "psychology",
  },
  {
    name: t("specializations.ophthalmology"),
    icon: "visibility",
  },
  {
    name: t("specializations.orthopedics"),
    icon: "accessibility_new",
  },
  {
    name: t("specializations.psychiatry"),
    icon: "psychology_alt",
  },
  {
    name: t("specializations.neurosurgery"),
    icon: "medical_services",
  },
  {
    name: t("specializations.allergy-and-immunology"),
    icon: "sick",
  },
  {
    name: t("specializations.anesthesiology"),
    icon: "mask",
  },
  {
    name: t("specializations.diagnostic-radiology"),
    icon: "biotech",
  },
  {
    name: t("specializations.emergency-medicine"),
    icon: "local_hospital",
  },
  {
    name: t("specializations.family-medicine"),
    icon: "group",
  },
  {
    name: t("specializations.internal-medicine"),
    icon: "medication",
  },
  {
    name: t("specializations.medical-genetics"),
    icon: "science",
  },
  {
    name: t("specializations.nuclear-medicine"),
    icon: "radiology",
  },
  {
    name: t("specializations.obstetrics-and-gynecology"),
    icon: "pregnant_woman",
  },
  {
    name: t("specializations.pathology"),
    icon: "microscope",
  },
  {
    name: t("specializations.rehab"),
    icon: "elderly",
  },
  {
    name: t("specializations.preventive-medicine"),
    icon: "health_and_safety",
  },
  {
    name: t("specializations.radiation-oncology"),
    icon: "radiology",
  },
  {
    name: t("specializations.surgery"),
    icon: "surgical",
  },
  {
    name: t("specializations.urology"),
    icon: "water_drop",
  },
  {
    name: t("specializations.gastroenterology"),
    icon: "stomach",
  },
];
