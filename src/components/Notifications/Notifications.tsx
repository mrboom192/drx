import Colors from "@/constants/Colors";
import { useUserData } from "@/stores/useUserStore";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextSemiBold } from "../StyledText";
import NotificationCard from "./NotificationCard";

const Notifications = () => {
  const userData = useUserData();
  const hasNoNotifications =
    userData?.verification !== "unverified" || userData?.hasPublicProfile; // Replace with actual logic to check for notifications

  return (
    <>
      {hasNoNotifications ? (
        <View style={styles.noNotificationsContainer}>
          <TextSemiBold style={styles.noNotifications}>
            No new notifications
          </TextSemiBold>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {/* <NotificationCard
            title="New Appointment"
            message="You have a new appointment scheduled."
          /> */}
          {(userData?.verification === "unverified" ||
            !userData?.verification) && (
            <NotificationCard
              title="Verification Required"
              message="Please verify your medical license."
              color={Colors.pink}
              url="/(protected)/(modals)/doctor-verification"
            />
          )}
          {(userData?.verification === "pending" ||
            !userData?.verification) && (
            <NotificationCard
              title="Awaiting Verification"
              message="We are currently working to review your license."
              color={Colors.yellow}
            />
          )}
          {!userData?.hasPublicProfile && (
            <NotificationCard
              title="No Public Profile"
              message="Set up a public profile so patients can find you."
              color={Colors.pink}
            />
          )}
        </ScrollView>
      )}
    </>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    flexGrow: 0,
  },
  contentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  noNotificationsContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
  },
  noNotifications: {
    color: Colors.lightText,
  },
});
