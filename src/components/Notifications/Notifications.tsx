import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextSemiBold } from "../StyledText";
import NotificationCard from "./NotificationCard";

const Notifications = () => {
  const hasNoNotifications = false; // Replace with actual logic to check for notifications

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {hasNoNotifications ? (
        <TextSemiBold style={styles.noNotifications}>
          No new notifications
        </TextSemiBold>
      ) : (
        <NotificationCard
          title="New Appointment"
          message="You have a new appointment scheduled."
        />
      )}
    </ScrollView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexGrow: 0,
  },
  contentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  noNotifications: {
    textAlign: "center",
    height: 70,
    color: Colors.grey,
  },
});
