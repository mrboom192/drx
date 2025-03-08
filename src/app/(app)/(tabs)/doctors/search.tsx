import { StyleSheet, ActivityIndicator, Text } from "react-native";
import { View } from "@/components/Themed";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Stack, useRouter } from "expo-router";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../../../../firebaseConfig";
import DoctorsHeader from "@/components/DoctorsHeader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DoctorMap from "@/components/DoctorMap";
import DoctorsBottomSheet from "@/components/DoctorsBottomSheet";
import Colors from "@/constants/Colors";

const Page = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any>([]);
  const [specialty, setSpecialty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // New state for error handling
  const [mapRegion, setMapRegion] = useState({
    minLat: 37.7749 - 0.05, // Example: San Francisco default region
    maxLat: 37.7749 + 0.05,
    minLng: -122.4194 - 0.05,
    maxLng: -122.4194 + 0.05,
  });

  // Function to fetch doctors based on visible region
  const fetchDoctors = useCallback(async () => {
    if (!mapRegion) return;

    setLoading(true);
    setError(null); // Reset error state before fetching

    try {
      const doctorsRef = collection(db, "public_profiles");

      let q;
      if (specialty === "All") {
        // Fetch up to 10 doctors, without specialty filter
        q = query(doctorsRef, limit(10));
      } else {
        // Fetch doctors by specialty + region filtering
        q = query(
          doctorsRef,
          where("specialty", "array-contains", specialty),
          where("hospital_coordinates.latitude", ">=", mapRegion.minLat),
          where("hospital_coordinates.latitude", "<=", mapRegion.maxLat),
          where("hospital_coordinates.longitude", ">=", mapRegion.minLng),
          where("hospital_coordinates.longitude", "<=", mapRegion.maxLng)
        );
      }

      console.log(
        "Querying Firestore:",
        specialty === "All"
          ? "Fetching all doctors"
          : `Fetching ${specialty} specialists`
      );

      const querySnapshot = await getDocs(q);
      let doctorsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // If fetching "All", manually filter by region
      if (specialty === "All") {
        doctorsList = doctorsList.filter(
          (doctor: any) =>
            doctor.hospital_coordinates?.latitude >= mapRegion.minLat &&
            doctor.hospital_coordinates?.latitude <= mapRegion.maxLat &&
            doctor.hospital_coordinates?.longitude >= mapRegion.minLng &&
            doctor.hospital_coordinates?.longitude <= mapRegion.maxLng
        );
      }

      console.log("Fetched doctors:", doctorsList);

      setDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to load doctors. Please try again."); // Set user-friendly error message
    } finally {
      setLoading(false);
    }
  }, [mapRegion, specialty]);

  // Fetch doctors when map region or specialty changes
  useEffect(() => {
    fetchDoctors();
  }, [mapRegion, specialty]);

  // Handle changes in specialty selection
  const onSpecialtyChange = (newSpecialty: string) => {
    setSpecialty(newSpecialty);
  };

  // Handle map region changes
  const onRegionChangeComplete = (region: any) => {
    setMapRegion({
      minLat: region.latitude - region.latitudeDelta / 2,
      maxLat: region.latitude + region.latitudeDelta / 2,
      minLng: region.longitude - region.longitudeDelta / 2,
      maxLng: region.longitude + region.longitudeDelta / 2,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => <DoctorsHeader onSpecialtyChange={onSpecialtyChange} />,
        }}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loading}
        />
      )}

      {/* Error Message UI */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Map & Bottom Sheet */}
      {!error && (
        <>
          <DoctorMap
            doctors={doctors}
            onRegionChangeComplete={onRegionChangeComplete}
          />
          <DoctorsBottomSheet
            loading={loading}
            doctors={doctors}
            specialty={specialty}
            error={error as any} // Pass error state to bottom sheet
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#660066",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  errorContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "80%",
    transform: [{ translateX: -100 }, { translateY: -25 }],
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  errorText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Page;
