import { getAndRegisterPushToken } from "@/api/notifications";
import LoadingScreen from "@/components/LoadingScreen";
import PageHeader from "@/components/PageHeader";
import { useSession } from "@/contexts/AuthContext";
import { useIsAuthReady } from "@/stores/useAuthInitStore";
import {
  useStartBillingListener,
  useStopBillingListener,
} from "@/stores/useBillingDetails";
import { useStopCasesListener } from "@/stores/useCaseStore";
import {
  useStartChatsListener,
  useStopChatsListener,
} from "@/stores/useChatStore";
import { useIsFetchingUser, useIsUserLoggedIn } from "@/stores/useUserStore";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { auth } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";

export default function ProtectedLayout() {
  const { t } = useTranslation();
  const { session, isLoading } = useSession();
  const isUserLoggedIn = useIsUserLoggedIn();
  const isFetchingUser = useIsFetchingUser();

  const startBillingListener = useStartBillingListener();
  const stopBillingListener = useStopBillingListener();

  // Chats
  const startChatsListener = useStartChatsListener();
  const stopChatsListener = useStopChatsListener();
  const stopCasesListener = useStopCasesListener();
  const isAuthReady = useIsAuthReady();
  const shouldRedirect =
    !session || auth.currentUser === null || !isUserLoggedIn;

  // Fetch chats from Firebase immediately
  useEffect(() => {
    if (!session || !isAuthReady) return;
    startChatsListener(); // Start listening to chats
    startBillingListener(); // Start listening to billing details
    getAndRegisterPushToken(); // Just in case, lets register the push token

    return () => {
      stopChatsListener();
      stopCasesListener();
      stopBillingListener();
    }; // Clean up on unmount
  }, [isAuthReady, session]);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading || isFetchingUser || !isAuthReady) return <LoadingScreen />;

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
      <Stack.Screen
        name="(modals)"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: t("common.notifications"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="bookmarked"
        options={{
          title: t("page.bookmarked-doctors"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="case"
        options={{
          title: t("page.case-information"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="medical-records"
        options={{
          title: t("page.medical-record"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="filtered"
        options={{
          title: "",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="search-modal"
        options={{
          title: t("page.search-doctors"),
          animation: "fade",
          animationDuration: 125,
          headerShadowVisible: false,
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
}
