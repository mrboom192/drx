import { TextRegular } from "@/components/StyledText";
import {
  isOfflineForDatabase,
  isOnlineForDatabase,
} from "@/constants/Presence";
import { useSession } from "@/contexts/AuthContext";
import {
  useIsFetchingUser,
  useIsUserLoggedIn,
  useStartUserListener,
} from "@/stores/useUserStore";
import { onAuthStateChanged } from "@firebase/auth";
import { Redirect, Stack } from "expo-router";
import { onDisconnect, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { auth, database } from "../../../firebaseConfig";

export default function ProtectedLayout() {
  const { session, isLoading } = useSession();
  const startUserListener = useStartUserListener();
  const isUserLoggedIn = useIsUserLoggedIn();
  const isFetchingUser = useIsFetchingUser();
  const [didCheckAuth, setDidCheckAuth] = useState(false);
  const shouldRedirect =
    !session || auth.currentUser === null || !isUserLoggedIn;

  useEffect(() => {
    let unsubscribePresence: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        return;
      } // User must be authenticated

      // Get the user's firebase uid
      const uid = user.uid;

      // Start the user listener to fetch user data
      startUserListener(uid);

      const userStatusRef = ref(database, "/status/" + uid);

      // A special path in the Realtime Database that is updated when the user's
      // client is connected (or disconnected!)
      const connectedRef = ref(database, ".info/connected");

      unsubscribePresence = onValue(connectedRef, (snap) => {
        // Return if we are not connected
        if (snap.val() === false) return;

        // When we disconnect (e.g., close app, reload, lose network),
        // the server will mark us offline.
        onDisconnect(userStatusRef)
          .set(isOfflineForDatabase)
          .then(() => {
            // Add a short delay before setting us online to help
            // reduce false "offline" flickers during reloads or something
            setTimeout(() => {
              set(userStatusRef, isOnlineForDatabase);
            }, 100); // 100ms debounce buffer
          });
      });
    });

    setDidCheckAuth(true);

    return () => {
      unsubscribeAuth(); // auth listener
      if (unsubscribePresence) unsubscribePresence(); // presence listener
    };
  }, []);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading || isFetchingUser || !didCheckAuth)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextRegular
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          Loading...
        </TextRegular>
      </View>
    );

  // Update this to the new router Expo SDK 53

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (shouldRedirect) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(chat)" />
      <Stack.Screen name="(call)" />
      <Stack.Screen name="doctor" />
      <Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
    </Stack>
  );
}
