import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import ArrowOutward from "../icons/ArrowOutward";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import Avatar from "../Avatar";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import InfoBottomSheet from "@/components/InfoBottomSheet";
import Filter from "../icons/Filter";
import Check from "../icons/Check";
import Clock from "../icons/Clock";

const mockCases = [
  {
    id: "7NP2gjEPQtGAKMLk",
    title: "Persistent Knee Pain After Injury",
    description:
      "I've been experiencing persistent knee pain for the past 3 months after a minor fall while jogging. The pain worsens with movement, and there is occasional swelling. My primary doctor suggested it might be a minor ligament strain, but I want a second opinion to confirm if further imaging or treatment is needed.",
    images: [
      "https://i.redd.it/lwiw8ukr8q7c1.jpeg",
      "https://preview.redd.it/22iubb45p2c31.jpg?width=1080&crop=smart&auto=webp&s=6167c597d3a12a69123cbc13c13d335e68b95b30",
    ],
    reviewed: false,
  },
  {
    id: "M5hEmAwxOfMDariM",
    title: "Recurring Insomnia",
    description:
      "I've been experiencing recurring insomnia even after several doctors visits",
    images: [
      "https://i.redd.it/sleep-cycle-user-with-3-628-logged-nights-v0-4uysp3sp108a1.jpg?width=1170&format=pjpg&auto=webp&s=51ebab3eac1c787651c4ee3246487a51eabe6058",
    ],
    reviewed: true,
  },
];

const RemoteManagement = () => {
  const { themeBorderStyle, themeTextStylePrimary, themeTextStyleSecondary } =
    useThemedStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present(); // Collapses bottom sheet, showing map
  }, []);

  const fetchRandomDoctors = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching

    try {
      const doctorsRef = collection(db, "public_profiles");

      // Fetch up to 50 doctors (to allow better randomness)
      const q = query(doctorsRef, limit(7));
      const querySnapshot = await getDocs(q);

      let doctorsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching random doctors:", error);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomDoctors();
  }, [fetchRandomDoctors]);

  return (
    <View style={{ flex: 1 }}>
      {/* Widgets */}
      <View
        style={{
          width: "100%",
          padding: 16,
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Text
          style={[themeTextStylePrimary, { fontSize: 20, fontFamily: "dm-sb" }]}
        >
          Remote ICU Management
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flexDirection: "column", gap: 8, flex: 1 }}>
            <TouchableOpacity
              onPress={handlePresentModalPress}
              style={[
                { backgroundColor: Colors.remoteICUManagementBackground },
                {
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <Text
                style={[
                  themeTextStylePrimary,
                  { fontSize: 16, fontFamily: "dm-sb" },
                ]}
              >
                About
              </Text>
              <ArrowOutward size={24} color={"#000"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                themeBorderStyle,
                {
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                },
              ]}
            >
              <Filter size={24} color={"#000"} />
              <Text
                style={[
                  themeTextStylePrimary,
                  { fontSize: 16, fontFamily: "dm-sb" },
                ]}
              >
                Provider preferences
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              { backgroundColor: Colors.remoteICUManagementBackground },
              {
                flex: 1,
                borderRadius: 16,
                padding: 16,
                flexDirection: "column",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text style={{ fontSize: 16, fontFamily: "dm-sb" }}>ICU Time</Text>
            <Text style={{ fontSize: 28, fontFamily: "dm-sb" }}>
              1hr 28mins
            </Text>
          </View>
        </View>
      </View>

      {/* Start a new case */}
      <View
        style={[
          themeBorderStyle,
          {
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            marginHorizontal: 16,
            marginBottom: 16,
            borderRadius: 16,
            overflow: "hidden",
          },
        ]}
      >
        {/* Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "column", gap: 8 }}>
            <Text
              style={[
                themeTextStylePrimary,
                { fontFamily: "dm-sb", fontSize: 20 },
              ]}
            >
              Cases
            </Text>
            <Text
              style={[
                themeTextStyleSecondary,
                { fontFamily: "dm", fontSize: 16 },
              ]}
            >
              1/2 Cases reviewed
            </Text>
          </View>
          <Link href={`/(app)/(tabs)/index`} asChild>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: Colors.light.grey,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.light.grey,
                  textAlign: "center",
                  fontFamily: "dm-sb",
                  fontSize: 12,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Second Opinion Requests */}
        <View
          style={[
            themeBorderStyle,
            { borderLeftWidth: 0, borderRightWidth: 0, paddingVertical: 16 },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              {
                alignItems: "center",
                gap: 16,
                paddingHorizontal: 16,
              },
            ]}
          >
            {mockCases.map((item) => (
              <Link href={`/(app)/(tabs)/index`} key={item.id} asChild>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.light.faintGrey,
                    padding: 16,
                    flexDirection: "column",
                    width: 155,
                    height: 155,
                    backgroundColor: "#FFF",
                    justifyContent: "space-between",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={2}
                    style={[
                      themeTextStylePrimary,
                      { fontFamily: "dm-sb", fontSize: 16 },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={2}
                    style={[
                      themeTextStyleSecondary,
                      { fontFamily: "dm", fontSize: 12 },
                    ]}
                  >
                    {item.description}
                  </Text>
                  {item.reviewed ? (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: "4",
                        alignItems: "center",
                      }}
                    >
                      <Check size={24} color={Colors.green} />
                      <Text
                        style={{
                          color: Colors.green,
                          fontFamily: "dm-sb",
                          fontSize: 12,
                        }}
                      >
                        Reviewed by 1
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: "4",
                        alignItems: "center",
                      }}
                    >
                      <Clock size={24} color={Colors.onlineConsultation} />
                      <Text
                        style={{
                          color: Colors.onlineConsultation,
                          fontFamily: "dm-sb",
                          fontSize: 12,
                        }}
                      >
                        Pending
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={{
            borderColor: "#000",
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: Colors.dark.background,
            margin: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <Text
            style={{
              color: "#FFF",
              fontFamily: "dm-sb",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Start a new case
          </Text>
        </TouchableOpacity>
      </View>

      <InfoBottomSheet ref={bottomSheetModalRef} />
    </View>
  );
};

export default RemoteManagement;
