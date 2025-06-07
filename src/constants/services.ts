import { Href } from "expo-router";
import { TFunction } from "i18next";

export const getOurServices = (t: TFunction) => [
  {
    name: t("services.get-peace-of-mind-with-an-expert-second-opinion"),
    buttonText: t("services.start-a-request"),
    image: require("@/../assets/images/services/relax.png"),
    backgroundColor: "#F4BCFF",
    href: "/(protected)/(modals)/create-second-opinion" as Href,
  },
  {
    name: t("services.have-a-doctor-review-your-radiology-scans"),
    buttonText: t("services.submit-a-review"),
    image: require("@/../assets/images/services/radiology.png"),
    backgroundColor: "#CDEAFB",
    href: "/search" as Href,
  },
  {
    name: t("services.start-your-weight-loss-journey-with-drx"),
    buttonText: t("services.find-a-doctor"),
    image: require("@/../assets/images/services/runners.png"),
    backgroundColor: "#B0C1BF",
    href: "/search" as Href,
  },
];
