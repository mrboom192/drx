const tintColorLight = "#7846FF"; // same as primary
const tintColorDark = "#7846FF"; // same as primary

export default {
  primary: "#7846FF", // purple
  yellow: "#FFB650", // stars/ratings
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
