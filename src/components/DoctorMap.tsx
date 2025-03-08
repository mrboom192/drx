import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { memo, useCallback } from "react";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { defaultStyles } from "@/constants/Styles";
import { useRouter } from "expo-router";
import MapView from "react-native-map-clustering"; // For efficient clustering
import { Doctor } from "@/types/doctor";

interface Props {
  doctors: Doctor[];
  onRegionChangeComplete: (region: any) => void;
}

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 9,
  longitudeDelta: 9,
};

// Memoized component for performance optimization
const DoctorMap = memo(({ doctors, onRegionChangeComplete }: Props) => {
  const router = useRouter();

  const onMarkerSelected = (doctor: Doctor) => {
    // Navigate to doctor details page when clicked (if needed)
    console.log("Doctor Selected:", doctor.name);
  };

  // Memoized function for cluster rendering
  const renderCluster = useCallback((cluster: any) => {
    const { id, geometry, onPress, properties } = cluster;
    const points = properties.point_count;

    return (
      <Marker
        key={`cluster-${id}`}
        onPress={onPress}
        coordinate={{
          latitude: geometry.coordinates[1], // Ensure latitude is second
          longitude: geometry.coordinates[0],
        }}
      >
        <TouchableOpacity style={styles.clusterMarker}>
          <Text style={styles.clusterText}>{points}</Text>
        </TouchableOpacity>
      </Marker>
    );
  }, []);

  return (
    <View style={defaultStyles.container}>
      <MapView
        // provider={PROVIDER_GOOGLE} // Ensures Google Maps provider is used
        animationEnabled={false}
        clusterColor="#FFF"
        clusterTextColor="#000"
        clusterFontFamily="dm-sb"
        style={StyleSheet.absoluteFill}
        showsUserLocation
        initialRegion={INITIAL_REGION}
        renderCluster={renderCluster}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {doctors.map((doctor: Doctor) => {
          if (
            doctor.hospital_coordinates?.latitude == null ||
            doctor.hospital_coordinates?.longitude == null
          ) {
            return null;
          }

          return (
            <Marker
              key={doctor.id}
              onPress={() => onMarkerSelected(doctor)}
              coordinate={{
                latitude: Number(doctor.hospital_coordinates.latitude),
                longitude: Number(doctor.hospital_coordinates.longitude),
              }}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>
                  ${doctor.consultation_price}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 10 },
  },
  markerText: {
    fontSize: 14,
    fontFamily: "dm-sb",
  },
  clusterMarker: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  clusterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
});

export default DoctorMap;
