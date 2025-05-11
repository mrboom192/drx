import { TextRegular } from "@/components/StyledText";
import { useSession } from "@/contexts/AuthContext";
import { onAuthStateChanged } from "@firebase/auth";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";

export const unstable_settings = {
  initialRouteName: "(tabs)", // anchor
};

export default function ProtectedLayout() {
  const { signOut, session, isLoading } = useSession();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading || !isAuthReady) {
    return <TextRegular>Loading...</TextRegular>;
  }

  // Update this to the new router Expo SDK 53

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session || auth.currentUser === null) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    signOut();
    return <Redirect href="/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="doctor" options={{ headerShown: false }} />
      <Stack.Screen name="[chatId]" />
      <Stack.Screen
        name="(modals)"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
}
