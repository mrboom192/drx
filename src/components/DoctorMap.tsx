import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  LayoutChangeEvent,
  Platform,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { router, useRouter } from "expo-router";
import { useFilteredDoctors } from "@/stores/useDoctorSearch";
import MapView, {
  Details,
  Marker,
  MarkerPressEvent,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { Clusterer } from "react-native-clusterer";
import ClusterMarker from "./map/ClusterMarker";
import LoadingScreen from "./LoadingScreen";
import { ClusterFeature } from "supercluster";
import { toPointFeature } from "@/utils/mapUtils";
import DoctorMarker from "./map/DoctorMarker";
import { useFilters } from "@/stores/useFilterStore";

const INITIAL_REGION = {
  latitude: 41.924447,
  longitude: -87.687339,
  latitudeDelta: 100,
  longitudeDelta: 100,
};

const DoctorMap = () => {
  const filters = useFilters();
  const doctors = useFilteredDoctors(filters);
  const [region, setRegion] = useState(INITIAL_REGION);
  const [mapDimensions, setMapDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const doctorPlaces = useMemo(() => {
    if (!doctors) return [];

    return doctors
      .filter(
        (
          doctor
        ): doctor is typeof doctor & {
          coordinates: { longitude: number; latitude: number };
        } => !!doctor.coordinates
      )
      .map((doctor) => {
        const { longitude, latitude } = doctor.coordinates;
        return toPointFeature(doctor, [longitude, latitude]);
      });
  }, [doctors]);

  const handleRegionChange = (newRegion: Region, details: Details): void => {
    // If OS is android, check if the change is due to a gesture
    if (Platform.OS === "android" && details?.isGesture) setRegion(newRegion);
    if (Platform.OS === "ios") setRegion(newRegion); // isGesture is undefined on iOS
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ width, height });
  };

  const renderMarker = (feature: ClusterFeature<any>) => {
    const [lng, lat] = feature.geometry.coordinates;
    const doctorUID = feature.properties?.uid;

    const isCluster = !!feature.properties?.cluster;
    // Date.now() fixes disappearing custom markers, albeit hacky
    const key = isCluster
      ? `cluster-${feature.properties.cluster_id}-${Date.now()}`
      : `point-${feature.properties.id}-${Date.now()}`;
    const markerProps = {
      identifier: isCluster ? doctorUID : key,
      coordinate: { latitude: lat, longitude: lng },
    };

    return isCluster ? (
      <ClusterMarker
        {...markerProps}
        key={key}
        count={feature.properties.point_count}
      />
    ) : (
      <DoctorMarker
        {...markerProps}
        key={key}
        firstName={feature.properties.firstName}
        lastName={feature.properties.lastName}
        image={feature.properties.image}
        uid={feature.properties.uid}
        price={feature.properties.consultationPrice}
      />
    );
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {mapDimensions ? (
        <MapView
          paddingAdjustmentBehavior="never"
          moveOnMarkerPress={false}
          provider={PROVIDER_DEFAULT}
          style={styles.mapView}
          region={region}
          onRegionChangeComplete={handleRegionChange}
        >
          <Clusterer
            data={doctorPlaces}
            region={region}
            mapDimensions={mapDimensions}
            renderItem={renderMarker}
          />
        </MapView>
      ) : (
        <LoadingScreen />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  markerText: {
    fontSize: 14,
    fontFamily: "dm-sb",
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
});

export default DoctorMap;
