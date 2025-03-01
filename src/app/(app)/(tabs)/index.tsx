import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Link, Stack, useRouter } from "expo-router";
import DoctorsHeader from "@/components/Header";
import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ header: () => <DoctorsHeader /> }} />

      <View style={{ marginTop: 32 }}>
        <Text>Welcome to MyJournal!!!!!!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 32,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#660066",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Page;
