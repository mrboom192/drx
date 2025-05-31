import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

const SIZE = 256; // Size of the loading animation

function LoadingScreen() {
  return (
    <Animated.View exiting={FadeOut.duration(100)} style={styles.container}>
      <LottieView
        source={require("@/../assets/lottie/loading.json")}
        loop
        autoPlay
        speed={1}
        style={{ height: SIZE, width: SIZE }}
      />
    </Animated.View>
  );
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Change to desired background color
  },
});
