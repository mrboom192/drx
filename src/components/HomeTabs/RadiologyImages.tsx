import { View, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import ArrowOutward from "../icons/ArrowOutward";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import InfoBottomSheet from "@/components/InfoBottomSheet";
import Filter from "../icons/Filter";
import { TextRegular, TextSemiBold } from "../StyledText";

const rays = [
  {
    id: "9cb0b261f4f2e023702957c6e18f072232fa677102",
    name: "Jason's Axial Brain Scan 1",
    image:
      "https://prod-images-static.radiopaedia.org/images/70135739/469cb0b261f4f2e023702957c6e18f072232fa677102f6a4a33e81298d771514.jpg",
  },
  {
    id: "9627b5a21c339c68ef79e4bf68460115cbc6aa",
    name: "Jason's Sagittal PD Fat Sat 1",
    image:
      "https://prod-images-static.radiopaedia.org/images/70138750/e53c56e62c59627b5a21c339c68ef79e4bf68460115cbc6aa9cf8cab63497392.png",
  },
  {
    id: "9d92da281dc44781873f73a31209fc6102e6580a29",
    name: "Jason's Frontal Wrist Scan 1",
    image:
      "https://prod-images-static.radiopaedia.org/images/70138719/0dbfe385c2be13c1529d92da281dc44781873f73a31209fc6102e6580a29ba23_big_gallery.jpeg",
  },
  {
    id: "63a0af8aeddba3c133e630f598658b5bc69a5e",
    name: "Jason's Sagittal Scan T1 1",
    image:
      "https://prod-images-static.radiopaedia.org/images/69774601/aeea82f41d466e7dc6c363a0af8aeddba3c133e630f598658b5bc69a5e812e1c.png",
  },
];

const RadiologyImages = () => {
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
          Radiology Images
        </TextSemiBold>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flexDirection: "column", gap: 8, flex: 1 }}>
            <TouchableOpacity
              onPress={handlePresentModalPress}
              style={[
                { backgroundColor: Colors.radiologyImagesBackground },
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
              <Filter size={24} color={"#000"} />
              <TextSemiBold style={[themeTextStylePrimary, { fontSize: 16 }]}>
                Provider preferences
              </TextSemiBold>
            </TouchableOpacity>
          </View>
          <View
            style={[
              { backgroundColor: Colors.radiologyImagesBackground },
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
              Images Reviewed
            </TextSemiBold>
            <TextSemiBold style={{ fontSize: 28 }}>133</TextSemiBold>
          </View>
        </View>
      </View>

      {/* Upload a new ray scan */}
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
            <TextSemiBold style={[themeTextStylePrimary, { fontSize: 20 }]}>
              Uploads
            </TextSemiBold>
            <TextRegular style={[themeTextStyleSecondary, { fontSize: 16 }]}>
              63/67 images reviewed
            </TextRegular>
          </View>
          <Link href={`/(protected)/(tabs)`} asChild>
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
              <TextRegular
                style={{
                  color: Colors.light.grey,
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                View All
              </TextRegular>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Ray Uploads */}
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
            {rays.map((item) => (
              <Link href={`/(protected)/(tabs)`} key={item.id} asChild>
                <TouchableOpacity
                  style={{
                    flexDirection: "column",
                    gap: 16,
                    width: 125,
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 125, height: 125, borderRadius: 8 }}
                  />
                  <TextRegular
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={[themeTextStyleSecondary, { fontSize: 12 }]}
                  >
                    {item.name}
                  </TextRegular>
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
          <TextRegular
            style={{
              color: "#FFF",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Upload
          </TextRegular>
        </TouchableOpacity>
      </View>

      <InfoBottomSheet ref={bottomSheetModalRef} />
    </View>
  );
};

export default RadiologyImages;
