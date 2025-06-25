import React, { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Text, LayoutChangeEvent } from "react-native";
import { useRouter } from "expo-router";
import { useFilteredDoctors } from "@/stores/useDoctorSearch";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { Clusterer } from "react-native-clusterer";
import ClusterMarker from "./map/ClusterMarker";
import LoadingScreen from "./LoadingScreen";
import { ClusterFeature } from "supercluster";
import { toPointFeature } from "@/utils/mapUtils";
import { TextSemiBold } from "./StyledText";
import DoctorMarker from "./map/DoctorMarker";

const INITIAL_REGION = {
  latitude: 41.924447,
  longitude: -87.687339,
  latitudeDelta: 1,
  longitudeDelta: 1,
};

export const PLACES = [
  { id: 1, latitude: 42.0, longitude: -87.0 },
  { id: 2, latitude: 42.1, longitude: -87.0 },
  { id: 3, latitude: 42.2, longitude: -87.0 },
  { id: 4, latitude: 42.3, longitude: -87.0 },
  { id: 5, latitude: 42.4, longitude: -87.0 },
];

const DoctorMap = ({ specialty }: { specialty: string }) => {
  const router = useRouter();
  const doctors = useFilteredDoctors(specialty);

  const [region, setRegion] = useState(INITIAL_REGION);
  const [mapDimensions, setMapDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const places = useMemo(() => PLACES.map(toPointFeature), []);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ width, height });
  };
  const renderMarker = (feature: ClusterFeature<any>) => {
    const [lng, lat] = feature.geometry.coordinates;

    const isCluster = !!feature.properties?.cluster;
    // Date.now() fixes disappearing custom markers, albeit hacky
    const key = isCluster
      ? `cluster-${feature.properties.cluster_id}-${Date.now()}`
      : `point-${feature.properties.id}-${Date.now()}`;

    return (
      <Marker key={key} coordinate={{ latitude: lat, longitude: lng }}>
        {isCluster ? (
          <ClusterMarker count={feature.properties.point_count} />
        ) : (
          <DoctorMarker count={1} />
        )}
      </Marker>
    );
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {mapDimensions ? (
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.mapView}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          <Clusterer
            data={places}
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
