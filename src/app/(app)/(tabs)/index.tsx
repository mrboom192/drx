import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Link, Stack, useRouter } from "expo-router";
import Header from "@/src/components/Header";
import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const router = useRouter();

  const handleOpenChallenges = () => {
    router.push("/challenges");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // This makes the phone vibrate
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ header: () => <Header /> }} />

      <View style={{ marginTop: 32 }}>
        <Text>Welcome to MyJournal!!!!!!</Text>

        <TouchableOpacity onPress={handleOpenChallenges} style={styles.button}>
          <Text style={styles.buttonText}>Click to see Challenges</Text>
        </TouchableOpacity>
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
