import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

const Footer = () => {
  return (
    <View style={styles.container}>
      <TextRegular style={styles.footerText}>
        DrX Telehealth is committed to providing you with excellent care and
        support. Learn more by reviewing our terms of services and privacy
        policy.
      </TextRegular>
      <View style={styles.trademark}>
        <Image
          style={styles.logo}
          source={require("@/../assets/images/icon.png")}
          contentFit="contain"
          transition={1000}
        />
        <TextSemiBold style={styles.logoDescription}>
          By DRX GENIUS LLC
        </TextSemiBold>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // Center everything horizontally
    justifyContent: "center", // Center vertically if needed
  },
  footerText: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 16,
    marginHorizontal: 16,
    textAlign: "center", // Center the text
  },
  trademark: {
    backgroundColor: Colors.black,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoDescription: {
    color: "#FFF",
    fontSize: 16,
  },
});
