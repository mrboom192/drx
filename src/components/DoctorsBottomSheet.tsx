import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Doctor } from "@/types/doctor";
import DoctorList from "./DoctorList";

interface Props {
  doctors: Doctor[];
  specialty: string;
  loading: boolean;
  error?: string;
}

const DoctorsBottomSheet = ({ loading, doctors, specialty, error }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();
  const [refresh, setRefresh] = useState(0);
  const snapPoints = useMemo(() => ["4%", "100%"], []);

  const showMap = () => {
    bottomSheetRef.current?.collapse();
    setRefresh((curr) => curr + 1);
  };

  return (
    <BottomSheet
      style={[
        {
          backgroundColor:
            colorScheme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
        styles.sheetContainer,
      ]}
      backgroundStyle={{
        backgroundColor:
          colorScheme === "light"
            ? Colors.light.background
            : Colors.dark.background,
      }}
      snapPoints={snapPoints}
      index={1}
      ref={bottomSheetRef}
      handleIndicatorStyle={{ backgroundColor: Colors.light.grey }}
      enablePanDownToClose={false}
    >
      <BottomSheetView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10 }}
      >
        {/* Loading State */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading doctors...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.center}>
            <Ionicons name="alert-circle" size={32} color="red" />
            <Text style={styles.errorText}>Failed to load data</Text>
            <Text style={styles.errorDetail}>{error}</Text>
          </View>
        )}

        {/* No Doctors Found */}
        {!loading && !error && doctors.length === 0 && (
          <View style={styles.center}>
            <Ionicons name="search" size={32} color="gray" />
            <Text style={styles.emptyText}>No doctors found</Text>
            <Text style={styles.emptySubText}>
              Try adjusting your filters or map region.
            </Text>
          </View>
        )}

        {/* Doctor List */}
        {!loading && !error && doctors.length > 0 && (
          <DoctorList
            doctors={doctors}
            specialty={specialty}
            refresh={refresh}
          />
        )}

        {/* Map Button */}
        <View style={styles.absoluteView}>
          <TouchableOpacity onPress={showMap} style={styles.btn}>
            <Text style={{ fontFamily: "dm-sb", color: "#FFF" }}>Map</Text>
            <Ionicons name="map" size={20} color={"#FFF"} />
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  absoluteView: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#1A1A1A",
    padding: 14,
    height: 50,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sheetContainer: {
    borderRadius: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  errorDetail: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  emptySubText: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default DoctorsBottomSheet;
