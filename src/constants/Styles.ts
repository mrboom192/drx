import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFFFF",
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "mon-b",
  },
  btnIcon: {
    position: "absolute",
    left: 16,
  },
  footer: {
    position: "absolute",
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: Colors.light.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export const themedStyles = StyleSheet.create({
  lightTextPrimary: {
    color: "#000",
    fontFamily: "DMSans_400Regular",
  },
  lightTextSecondary: {
    color: Colors.light.grey,
    fontFamily: "DMSans_400Regular",
  },
  darkTextPrimary: {
    color: "#FFF",
    fontFamily: "DMSans_400Regular",
  },
  darkTextSecondary: {
    color: Colors.dark.grey,
    fontFamily: "DMSans_400Regular",
  },
  lightBorder: {
    borderWidth: 1,
    borderColor: Colors.light.faintGrey,
  },
  darkBorder: {
    borderWidth: 1,
    borderColor: Colors.dark.faintGrey,
  },
});
