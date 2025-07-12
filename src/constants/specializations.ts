import { TFunction } from "i18next";
import Colors from "./Colors";

export const getDoctorLabels = (t: TFunction) => [
  {
    value: "doctor",
    label: t("practitioners.physician"),
    color: Colors.skyBlue,
  },
  {
    value: "nurse",
    label: t("practitioners.nurse"),
    color: Colors.red,
  },
  {
    value: "intern",
    label: t("practitioners.medical-intern"),
    color: Colors.magenta,
  },
];

export const getSpecializations = (t: TFunction) => [
  {
    value: "general practice",
    label: t("specializations.general-practice"),
  },
  {
    value: "pediatrics",
    label: t("specializations.pediatrics"),
  },
  {
    value: "cardiology",
    label: t("specializations.cardiology"),
  },
  {
    value: "dermatology",
    label: t("specializations.dermatology"),
  },
  {
    value: "oncology",
    label: t("specializations.oncology"),
  },
  {
    value: "neurology",
    label: t("specializations.neurology"),
  },
  {
    value: "ophthalmology",
    label: t("specializations.ophthalmology"),
  },
  {
    value: "orthopedics",
    label: t("specializations.orthopedics"),
  },
  {
    value: "psychiatry",
    label: t("specializations.psychiatry"),
  },
  {
    value: "neurosurgery",
    label: t("specializations.neurosurgery"),
  },
  {
    value: "allergy and immunology",
    label: t("specializations.allergy-and-immunology"),
  },
  {
    value: "anesthesiology",
    label: t("specializations.anesthesiology"),
  },
  {
    value: "diagnostic radiology",
    label: t("specializations.diagnostic-radiology"),
  },
  {
    value: "emergency medicine",
    label: t("specializations.emergency-medicine"),
  },
  {
    value: "family medicine",
    label: t("specializations.family-medicine"),
  },
  {
    value: "internal medicine",
    label: t("specializations.internal-medicine"),
  },
  {
    value: "medical genetics",
    label: t("specializations.medical-genetics"),
  },
  {
    value: "nuclear medicine",
    label: t("specializations.nuclear-medicine"),
  },
  {
    value: "obstetrics and gynecology",
    label: t("specializations.obstetrics-and-gynecology"),
  },
  {
    value: "pathology",
    label: t("specializations.pathology"),
  },
  {
    value: "rehab",
    label: t("specializations.rehab"),
  },
  {
    value: "preventive medicine",
    label: t("specializations.preventive-medicine"),
  },
  {
    value: "radiation oncology",
    label: t("specializations.radiation-oncology"),
  },
  {
    value: "surgery",
    label: t("specializations.surgery"),
  },
  {
    value: "urology",
    label: t("specializations.urology"),
  },
  {
    value: "gastroenterology",
    label: t("specializations.gastroenterology"),
  },
];
