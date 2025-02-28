import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const challenges = [
  {
    id: "1",
    title: "Write an entry for today",
    points: 5,
    description: "Write anything on your mind today!",
  },
  {
    id: "2",
    title: "Write down a new recipe",
    points: 10,
    description:
      "Learned a new recipe? Make sure to keep track of it! Write down the ingredients and instructions.",
  },
  {
    id: "3",
    title: "Favorite memory",
    points: 10,
    description: "Want to remember a moment forever? Make sure to write it!",
  },
  {
    id: "4",
    title: "Movies/Shows List",
    points: 10,
    description: "Create a list of your favorite shows/movies.",
  },
  {
    id: "5",
    title: "Gym Plan",
    points: 10,
    description: "Make sure to stay on track by creating a gym plan.",
  },
  {
    id: "6",
    title: "Goals",
    points: 10,
    description:
      "Write an entry reflecting on the goals you have set for this year!",
  },
  {
    id: "7",
    title: "Travel Journal ",
    points: 10,
    description:
      "Write down places, hotels, locations visited, and important information here.",
  },
];

const Challenges = () => {
  const router = useRouter();
  const [streak, setStreak] = useState(0);

  const checkStreak = async () => {
    try {
      const lastOpened = await AsyncStorage.getItem("lastOpened");
      const storedStreak = await AsyncStorage.getItem("streak");

      const today = new Date().toDateString();
      if (lastOpened === today) {
        return; // Already opened today, do nothing
      }

      if (lastOpened) {
        const lastDate = new Date(lastOpened);
        const difference = (new Date(today) - lastDate) / (1000 * 60 * 60 * 24); // Difference in days

        if (difference === 1) {
          // User came back the next day, increase streak
          const newStreak = parseInt(storedStreak || "0") + 1;
          setStreak(newStreak);
          await AsyncStorage.setItem("streak", newStreak.toString());
        } else {
          // User skipped a day, reset streak
          setStreak(1);
          await AsyncStorage.setItem("streak", "1");
        }
      } else {
        // First time opening the app
        setStreak(1);
        await AsyncStorage.setItem("streak", "1");
      }

      // Update last opened date
      await AsyncStorage.setItem("lastOpened", today);
    } catch (error) {
      console.error("Error checking streak:", error);
    }
  };

  useEffect(() => {
    checkStreak();
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Header with Streak Flame 🔥 */}

      <Text style={styles.title}>Challenges</Text>
      <View style={styles.streakContainer}>
        <Text style={styles.streakText}>{streak} Days Streak🔥</Text>
      </View>

      {/* Challenge List */}
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.challengeItem}>
            <Text style={styles.challengeText}>
              {item.title} - {item.points} points
            </Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    color: "#660066",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  challengeItem: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginVertical: 5,
  },
  challengeText: {
    fontSize: 18,
    color: "#660066",
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },

  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 8,
    borderRadius: 10,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 0,
    color: "orange",
    textAlign: "center",
    flex: 1,
  },
});

export default Challenges;
