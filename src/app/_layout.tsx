import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SessionProvider } from "../contexts/AuthContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useColorScheme } from "@/components/useColorScheme";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "@/hooks/useThemeStyles";

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

export default function RootLayout() {
  const [loaded, error] = useFonts({
    dm: require("../../assets/fonts/DMSans-Regular.ttf"),
    "dm-sb": require("../../assets/fonts/DMSans-SemiBold.ttf"),
    "dm-b": require("../../assets/fonts/DMSans-Bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();
  const { colorScheme } = useThemedStyles();

  // Need to make a header function that looks good!!
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <Stack
          screenOptions={{
            navigationBarColor: "#FFF",
          }}
        >
          <Stack.Screen
            name="(modals)/filter"
            options={{
              title: "Filters",
              headerTitleStyle: {
                fontFamily: "dm-sb",
              },
              presentation: "modal",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={colorScheme === "light" ? "#000" : "#FFF"}
                  />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>
      </SessionProvider>
    </ThemeProvider>
  );
}
