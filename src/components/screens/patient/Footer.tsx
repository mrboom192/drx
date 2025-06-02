import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const Footer = () => {
  return (
    <View style={styles.container}>
      <TextRegular style={styles.footerText}>
        DrX Telehealth is committed to providing you with excellent care and
        support. Learn more by reviewing our{" "}
        <Link href="/terms-of-service">
          <TextRegular style={styles.textLink}>Terms of Service</TextRegular>
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy">
          {" "}
          <TextRegular style={styles.textLink}>Privacy Policy</TextRegular>
        </Link>
        .
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
  textLink: {
    textDecorationLine: "underline",
  },
  trademark: {
    backgroundColor: Colors.black,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // Overscroll effect
    paddingBottom: 999,
    marginBottom: -999,
  },
  logo: {
    width: 64,
    height: 64,
  },
  logoDescription: {
    color: "#FFF",
    fontSize: 16,
  },
});
