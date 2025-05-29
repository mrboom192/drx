import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

// AsyncStorage key to store the device's push token
const PUSH_TOKEN_STORAGE_KEY = "expoPushToken";

/**
 * Get the Expo push token and register it to the user's Firestore document.
 * Uses auth.currentUser.uid directly.
 */
export async function getAndRegisterPushToken() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No authenticated user found. Cannot register push token.");
      return;
    }

    // Check permissions
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.warn("Notification permission not granted.");
        return;
      }
    }

    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const expoPushToken = tokenData.data;

    // Store token locally
    await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, expoPushToken);

    // Register token in Firestore
    await registerPushToken(expoPushToken);
    console.log(`Push token ${expoPushToken} registered for user ${user.uid}`);
  } catch (error) {
    console.error("Error getting or registering push token:", error);
  }
}

/**
 * Register a push token for the authenticated user in Firestore.
 * @param expoPushToken Expo push token
 */
export async function registerPushToken(expoPushToken: string) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No authenticated user found. Cannot register push token.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      expoPushTokens: arrayUnion(expoPushToken),
    });
  } catch (error) {
    console.error("Error registering push token:", error);
  }
}

/**
 * Unregister the current device's push token from Firestore.
 * Uses auth.currentUser.uid and removes the token from AsyncStorage.
 */
export async function unregisterPushToken() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn(
        "No authenticated user found. Cannot unregister push token."
      );
      return;
    }

    const expoPushToken = await AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
    if (!expoPushToken) {
      console.warn("No stored push token found to unregister.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      expoPushTokens: arrayRemove(expoPushToken),
    });

    await AsyncStorage.removeItem(PUSH_TOKEN_STORAGE_KEY);
    console.log(
      `Push token ${expoPushToken} unregistered for user ${user.uid}`
    );
  } catch (error) {
    console.error("Error unregistering push token:", error);
  }
}
