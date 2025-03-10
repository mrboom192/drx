import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import ArrowOutward from "../icons/ArrowOutward";
import HealthShield from "../icons/HealthShield";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Doctor } from "@/types/doctor";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import Avatar from "../Avatar";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import InfoBottomSheet from "@/components/InfoBottomSheet";
import Spinner from "../icons/Spinner";

const OnlineConsultation = () => {
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
          Online Consultations
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flexDirection: "column", gap: 8, flex: 1 }}>
            <TouchableOpacity
              onPress={handlePresentModalPress}
              style={[
                { backgroundColor: "#FFECD9" },
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
              <HealthShield size={24} color={"#FF4346"} />
              <Text
                style={[
                  themeTextStylePrimary,
                  { fontSize: 16, fontFamily: "dm-sb" },
                ]}
              >
                View medical record
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              { backgroundColor: "#FFECD9" },
              {
                flex: 1,
                borderRadius: 16,
                padding: 16,
                flexDirection: "column",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text style={{ fontSize: 16, fontFamily: "dm-sb" }}>
              Total Consultations
            </Text>
            <Text style={{ fontSize: 32, fontFamily: "dm-sb" }}>10</Text>
          </View>
        </View>
      </View>

      {/* Recommended doctors */}
      <View style={{ flexDirection: "column", gap: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 16,
          }}
        >
          <Text
            style={[
              themeTextStylePrimary,
              { fontSize: 20, fontFamily: "dm-sb" },
            ]}
          >
            Suggested doctors
          </Text>
          <Link href={`/(app)/(tabs)/doctors/search`} asChild>
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 16,
          }}
        >
          {doctors.map((item, index) => (
            <Link href={`/doctor/${item.id}`} key={item.id} asChild>
              <TouchableOpacity
                style={{
                  width: 200,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: Colors.light.faintGrey,
                  borderRadius: 16,
                  flexDirection: "column",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <Avatar size={64} uri={item.photo_url} />
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={[
                      themeTextStylePrimary,
                      { fontFamily: "dm-sb", fontSize: 16 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title} {item.name}
                  </Text>

                  <Text
                    style={[
                      themeTextStyleSecondary,
                      { fontFamily: "dm", fontSize: 12 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.specialty.join(", ")}
                  </Text>
                </View>

                <Text
                  style={[
                    themeTextStylePrimary,
                    { fontFamily: "dm-sb", fontSize: 20 },
                  ]}
                >
                  {item.consultation_price} {item.currency}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>

      <InfoBottomSheet ref={bottomSheetModalRef} />
    </View>
  );
};

export default OnlineConsultation;
