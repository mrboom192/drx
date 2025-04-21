import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import ArrowOutward from "../icons/ArrowOutward";
import HealthShield from "../icons/HealthShield";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import Avatar from "../Avatar";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import InfoBottomSheet from "@/components/InfoBottomSheet";
import Dot from "../icons/Dot";
import Bookmark from "../icons/Bookmark";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextRegular, TextSemiBold, TextBold } from "../StyledText";

const mockTags = [
  {
    name: "Speaks Arabic",
    color: "#8EFFC3",
  },
  {
    name: "Highly Rated (4.4)",
    color: "#FFCD87",
  },
  {
    name: "15+ years experience",
    color: "#FF86B2",
  },
  {
    name: "USA",
    color: "#B7DEFF",
  },
];

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
      const doctorsRef = collection(db, "publicProfiles");

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

  const renderDetails = () => {
    return (
      <View
        style={{
          flex: 1,
          padding: 16,
          marginBottom: 48,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "column", gap: 8 }}>
          <LottieView
            source={require("@/../assets/lottie/doctorWave.json")}
            loop={true}
            autoPlay={true}
            speed={1}
            style={{
              height: 200,
              pointerEvents: "none",
            }}
          />
          <TextSemiBold style={[themeTextStylePrimary, { fontSize: 20 }]}>
            Online Consultations
          </TextSemiBold>
          <TextRegular>
            Our Online Consultation service brings healthcare directly to you,
            offering convenient and secure virtual appointments with licensed
            medical professionals.
          </TextRegular>
        </View>

        <TouchableOpacity
          onPress={() => bottomSheetModalRef.current?.close()}
          style={{
            borderRadius: 16,
            backgroundColor: Colors.dark.background,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <TextSemiBold
            style={{
              color: "#FFF",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Ok!
          </TextSemiBold>
        </TouchableOpacity>
      </View>
    );
  };

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
        <TextSemiBold style={[themeTextStylePrimary, { fontSize: 20 }]}>
          Online Consultations
        </TextSemiBold>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flexDirection: "column", gap: 8, flex: 1 }}>
            <TouchableOpacity
              onPress={handlePresentModalPress}
              style={[
                { backgroundColor: Colors.peach },
                {
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <TextSemiBold style={[themeTextStylePrimary, { fontSize: 16 }]}>
                About
              </TextSemiBold>
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
              <TextSemiBold style={[themeTextStylePrimary, { fontSize: 16 }]}>
                View medical record
              </TextSemiBold>
            </TouchableOpacity>
          </View>
          <View
            style={[
              { backgroundColor: Colors.peach },
              {
                flex: 1,
                borderRadius: 16,
                padding: 16,
                flexDirection: "column",
                justifyContent: "space-between",
              },
            ]}
          >
            <TextSemiBold style={{ fontSize: 16 }}>
              Total Consultation Time
            </TextSemiBold>
            <TextSemiBold style={{ fontSize: 28 }}>134 mins</TextSemiBold>
          </View>
        </View>
      </View>

      {/* Recommended doctors */}
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            margin: 16,
          }}
        >
          <TextSemiBold style={[themeTextStylePrimary, { fontSize: 20 }]}>
            Suggested doctors
          </TextSemiBold>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: Colors.green,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Dot color={Colors.green} size={8} />
            <TextRegular
              style={{
                color: Colors.green,
                textAlign: "center",
                fontSize: 12,
              }}
            >
              3302 Online
            </TextRegular>
          </View>
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
            <Link
              href={`/doctor-profile/${item.uid}` as any}
              key={item.uid}
              asChild
            >
              <TouchableOpacity
                style={{
                  width: 300,
                  padding: 16,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  flexDirection: "column",
                  gap: 12,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 3,
                }}
              >
                {/* Doctor General Information */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Avatar size={56} uri={item.image} />
                  <View style={{ flex: 1 }}>
                    <TextSemiBold
                      style={[
                        themeTextStylePrimary,
                        { fontSize: 16, marginBottom: 4 },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Dr. {item.firstName + " " + item.lastName}
                    </TextSemiBold>

                    <View
                      style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}
                    >
                      {item.specializations
                        .slice(0, 2)
                        .map((spec: string, idx: number) => (
                          <View
                            key={idx}
                            style={{
                              backgroundColor: Colors.light.faintGrey,
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 12,
                            }}
                          >
                            <TextRegular
                              style={{
                                fontSize: 12,
                                color: Colors.light.grey,
                              }}
                            >
                              {spec}
                            </TextRegular>
                          </View>
                        ))}
                      {item.specializations.length > 2 && (
                        <TextRegular
                          style={{
                            fontSize: 12,
                            color: Colors.light.grey,
                          }}
                        >
                          +{item.specializations.length - 2} more
                        </TextRegular>
                      )}
                    </View>
                  </View>
                </View>

                {/* Price and Rating Section */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: Colors.light.faintGrey,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <TextSemiBold
                      style={[themeTextStylePrimary, { fontSize: 14 }]}
                    >
                      4.8
                    </TextSemiBold>
                    <TextRegular
                      style={[themeTextStyleSecondary, { fontSize: 12 }]}
                    >
                      (124)
                    </TextRegular>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      gap: 2,
                    }}
                  >
                    <TextSemiBold
                      style={[themeTextStylePrimary, { fontSize: 20 }]}
                    >
                      ${item.consultationPrice}
                    </TextSemiBold>
                    <TextRegular
                      style={[themeTextStyleSecondary, { fontSize: 12 }]}
                    >
                      /consultation
                    </TextRegular>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>

        {/* Buttons */}
        <View style={{ flexDirection: "column", gap: 8, margin: 16 }}>
          <TouchableOpacity
            style={{
              borderColor: Colors.dark.background,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: "#FFF",

              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <Bookmark color={Colors.dark.background} size={20} />
            <TextSemiBold
              style={{
                color: Colors.dark.background,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              View bookmarked (6)
            </TextSemiBold>
          </TouchableOpacity>
          <Link href={"/search"} asChild>
            <TouchableOpacity
              style={{
                borderColor: Colors.dark.background,
                borderWidth: 1,
                borderRadius: 8,
                backgroundColor: Colors.dark.background,
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              <TextSemiBold
                style={{
                  color: "#FFF",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Search all doctors
              </TextSemiBold>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <InfoBottomSheet content={renderDetails()} ref={bottomSheetModalRef} />
    </View>
  );
};

const Tag = ({ name, color }: { name: string; color: string }) => {
  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: color,
      }}
    >
      <TextRegular style={{ color: "#000", fontSize: 14 }}>{name}</TextRegular>
    </View>
  );
};

export default OnlineConsultation;
