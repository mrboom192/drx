import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useCallback, useRef } from "react";
import { Link, Stack } from "expo-router";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { SafeAreaView } from "@/components/Themed";
import Colors from "@/constants/Colors";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import InfoBottomSheet from "@/components/InfoBottomSheet";
import HomeHeader from "@/components/HomeHeader";

const Page = () => {
  const {
    colorScheme,
    themeBorderStyle,
    themeTextStylePrimary,
    themeTextStyleSecondary,
  } = useThemedStyles();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present(); // Collapses bottom sheet, showing map
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === "light"
            ? Colors.light.background
            : Colors.dark.background,
      }}
    >
      <Stack.Screen
        options={{
          header: () => <HomeHeader />,
        }}
      />
      <View style={styles.container}>
        {/* Card */}
        <View
          style={{
            flexDirection: "column",
            backgroundColor: Colors.primary,
            borderRadius: 16,
            padding: 16,
            margin: 16,
            gap: 14,
          }}
        >
          <Text style={{ color: "#FFF", fontFamily: "dm-sb", fontSize: 20 }}>
            Online Consultations
          </Text>

          {/* Description */}
          <Text style={{ color: "#FFF", fontFamily: "dm", fontSize: 16 }}>
            Find specialist doctors who can consult, diagnose, and prescribe
          </Text>

          {/* Inner Button */}
          <Link href={`/(app)/(tabs)/doctors/search`} asChild>
            <TouchableOpacity
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: "#FFF",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "dm-sb",
                  fontSize: 16,
                }}
              >
                Search
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            height: 200,
            borderWidth: 0,
            alignItems: "center",
            gap: 16,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          {/* Card */}
          <View
            style={{
              flexDirection: "column",
              width: 200,
              backgroundColor: "#000",
              borderRadius: 32,
              padding: 16,
              gap: 14,
            }}
          >
            <Text style={{ color: "#FFF", fontFamily: "dm-sb", fontSize: 20 }}>
              Second Opinion
            </Text>

            {/* Description */}
            <Text style={{ color: "#FFF", fontFamily: "dm", fontSize: 16 }}>
              Need a second opinion? Find a doctor to support your care.
            </Text>

            {/* Inner Button */}
            <TouchableOpacity
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: "#FFF",
                justifyContent: "center",
              }}
              onPress={handlePresentModalPress}
            >
              <Text
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "dm-sb",
                  fontSize: 16,
                }}
              >
                Learn More
              </Text>
            </TouchableOpacity>
          </View>
          {/* Card */}
          <View
            style={{
              flexDirection: "column",
              width: 200,
              backgroundColor: "#000",
              borderRadius: 32,
              padding: 16,
              gap: 14,
            }}
          >
            <Text style={{ color: "#FFF", fontFamily: "dm-sb", fontSize: 20 }}>
              Second Opinion
            </Text>

            {/* Description */}
            <Text style={{ color: "#FFF", fontFamily: "dm", fontSize: 16 }}>
              Need a second opinion? Find a doctor to support your care.
            </Text>

            {/* Inner Button */}
            <TouchableOpacity
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: "#FFF",
                justifyContent: "center",
              }}
              onPress={handlePresentModalPress}
            >
              <Text
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "dm-sb",
                  fontSize: 16,
                }}
              >
                Learn More
              </Text>
            </TouchableOpacity>
          </View>
          {/* Card */}
          <View
            style={{
              flexDirection: "column",
              width: 200,
              backgroundColor: "#000",
              borderRadius: 32,
              padding: 16,
              gap: 14,
            }}
          >
            <Text style={{ color: "#FFF", fontFamily: "dm-sb", fontSize: 20 }}>
              Second Opinion
            </Text>

            {/* Description */}
            <Text style={{ color: "#FFF", fontFamily: "dm", fontSize: 16 }}>
              Need a second opinion? Find a doctor to support your care.
            </Text>

            {/* Inner Button */}
            <TouchableOpacity
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: "#FFF",
                justifyContent: "center",
              }}
              onPress={handlePresentModalPress}
            >
              <Text
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "dm-sb",
                  fontSize: 16,
                }}
              >
                Learn More
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <InfoBottomSheet ref={bottomSheetModalRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 16,
  },
  filterBtn: {
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    gap: 10,
    flex: 1,
    padding: 14,
    borderRadius: 30,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 9999,
  },
});

export default Page;
