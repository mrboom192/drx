import { Stack } from "expo-router";
import React from "react";

const CallLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
  );
};

export default CallLayout;
