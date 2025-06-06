import PageHeader from "@/components/PageHeader";
import ExpoStripeProvider from "@/components/stripe-provider";
import { SignUpProvider } from "@/contexts/SignupContext";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { useIsAuthReady, useSetIsAuthReady } from "@/stores/useAuthInitStore";
import { useStartNotifications } from "@/stores/useNotificationStore";
import {
  useStartUserListener,
  useStopUserListener,
} from "@/stores/useUserStore";
import { initUserPresence } from "@/utils/presence";
import {
  DMSans_400Regular,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values"; // Required for nanoid
import { KeyboardProvider } from "react-native-keyboard-controller";
import { auth } from "../../firebaseConfig";
import { SessionProvider } from "../contexts/AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const startNotifications = useStartNotifications();
  const startUserListener = useStartUserListener();
  const stopUserListener = useStopUserListener();
  const setIsAuthReady = useSetIsAuthReady();
  const isAuthReady = useIsAuthReady();
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  // Start notifications when the app loads
  useEffect(() => {
    const unsubscribeNotifications = startNotifications();
    return unsubscribeNotifications;
  }, [startNotifications]);

  useEffect(() => {
    let unsubscribePresence: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get the user's firebase uid
        const uid = user.uid;

        // Start the user listener to fetch user data
        startUserListener(uid);

        // Immediately set the user's presence to online
        unsubscribePresence = initUserPresence(uid);
      } else {
        // User is signed out, stop the user listener
        stopUserListener();
      }

      // Set the auth state to ready
      setIsAuthReady(true);
    });

    return () => {
      unsubscribeAuth(); // auth listener
      if (unsubscribePresence) {
        unsubscribePresence(); // presence listener
      }
    };
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded && isAuthReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isAuthReady]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { colorScheme } = useThemedStyles();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <BottomSheetModalProvider>
          <ExpoStripeProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <SessionProvider>
                <SignUpProvider>
                  <Stack
                    screenOptions={{
                      navigationBarColor: "#FFF",
                    }}
                  >
                    <Stack.Screen
                      name="(protected)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="login"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="signup"
                      options={{
                        title: "Sign up with DrX",
                        header: (props) => <PageHeader {...props} />,
                      }}
                    />
                    <Stack.Screen
                      name="terms-of-service"
                      options={{
                        title: "Terms of Service",
                        header: (props) => <PageHeader {...props} />,
                      }}
                    />
                    <Stack.Screen
                      name="privacy-policy"
                      options={{
                        title: "Privacy Policy",
                        header: (props) => <PageHeader {...props} />,
                      }}
                    />
                  </Stack>
                </SignUpProvider>
              </SessionProvider>
            </ThemeProvider>
          </ExpoStripeProvider>
        </BottomSheetModalProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
function startUserListener(uid: string) {
  throw new Error("Function not implemented.");
}
