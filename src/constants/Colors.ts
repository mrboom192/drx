const tintColorLight = "#7846FF"; // same as primary
const tintColorDark = "#7846FF"; // same as primary

export default {
  primary: "#7846FF", // purple
  yellow: "#FFB650", // stars/ratings
  green: "#47DE8D",
  pink: "#FF2776",
  gold: "#E5A21B",

  onlineConsultation: "#FF8E43", // orange
  peach: "#FFECD9", // peach

  secondOpinion: "#43C0FF", // sky blue
  secondOpinionBackground: "#D9F4FF", // light blue

  radiologyImages: "#FF4346", // red
  radiologyImagesBackground: "#FFEDEF", // blush pink

  weightManagement: "#D556FF", // magenta
  lightLavender: "#FBEDFD", // light lavender

  remoteICUManagement: "#998AFF", // periwinkle
  remoteICUManagementBackground: "#EDEFFE", // soft lilac

  light: {
    text: "#000000", // primary text
    grey: "#595959", // secondary text/disabled icons
    background: "#FFFFFF", // background
    tint: tintColorLight, // primary
    tabIconDefault: "#DDDDDD", // light grey (outline)
    tabIconSelected: tintColorLight,
    faintGrey: "#DDD", // component outlines
  },
  dark: {
    text: "#FFFFFF", // primary text
    grey: "#AAAAAA", // secondary text/disabled icons
    background: "#131313", // background
    tint: tintColorDark, // primary
    tabIconDefault: "#333", // dark grey (outline)
    tabIconSelected: tintColorDark,
    faintGrey: "#333", // component outlines
  },
};
