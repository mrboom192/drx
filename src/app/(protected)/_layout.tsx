import PageHeader from "@/components/PageHeader";
import { TextRegular } from "@/components/StyledText";
import { useSession } from "@/contexts/AuthContext";
import { useIsAuthReady } from "@/stores/useAuthInitStore";
import { useIsFetchingUser, useIsUserLoggedIn } from "@/stores/useUserStore";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { auth } from "../../../firebaseConfig";

export default function ProtectedLayout() {
  const { session, isLoading } = useSession();
  const isUserLoggedIn = useIsUserLoggedIn();
  const isFetchingUser = useIsFetchingUser();
  const isAuthReady = useIsAuthReady();
  const shouldRedirect =
    !session || auth.currentUser === null || !isUserLoggedIn;

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading || isFetchingUser || !isAuthReady)
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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(chat)" options={{ headerShown: false }} />
      <Stack.Screen name="(call)" options={{ headerShown: false }} />
      <Stack.Screen name="doctor" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
}
