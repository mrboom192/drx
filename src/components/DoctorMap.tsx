import { defaultStyles } from "@/constants/Styles";
import { Doctor } from "@/types/doctor";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
// import { Marker } from "react-native-maps";

interface Props {
  doctors: any;
}

// 2:58:47

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 9,
  longitudeDelta: 9,
};

// Memoize map component to prevent it from rerendering, making it alot faster
const DoctorMap = memo(({ doctors }: Props) => {
  const router = useRouter();

  const onMarkerSelected = (item: Doctor) => {
    //   router.navigate(`/listing/${item.properties.id}`);
  };

  const renderCluster = (cluster: any) => {
    const { id, geometry, onPress, properties } = cluster;

    const points = properties.point_count;

    return (
      <></>
      // <Marker
      //   key={`cluster-${id}`}
      //   onPress={onPress}
      //   coordinate={{
      //     longitude: geometry.coordinates[0],
      //     latitude: geometry.coordinates[1],
      //   }}
      // >
      //   <TouchableOpacity style={styles.marker}>
      //     <TextSemiBold
      //       style={{
      //         color: "#000",
      //         textAlign: "center",
      //       }}
      //     >
      //       {points}
      //     </TextSemiBold>
      //   </TouchableOpacity>
      // </Marker>
    );
  };

  // When deploying, using Apple Maps or Google Maps will require additional configuration
  // showsMyLocationButton button only appears on PROVIDER_GOOGLE, which is bugged for expo go
  return (
    <View style={defaultStyles.container}>
      {/* <MapView
        animationEnabled={false}
        provider={PROVIDER_GOOGLE}
        clusterColor="#FFF"
        clusterTextColor="#000"
        clusterFontFamily="dm-sb"
        style={StyleSheet.absoluteFill}
        showsUserLocation
        initialRegion={INITIAL_REGION}
        renderCluster={renderCluster}
      >
        {doctors.map((item: Doctor) => (
          <Marker
            key={item.id}
            onPress={() => onMarkerSelected(item)}
            coordinate={{
              latitude: +item.hospital_coordinates.latitude, // + converts to number type
              longitude: +item.hospital_coordinates.longitude,
            }}
          >
            <View style={styles.marker}>
              <Avatar size={24} uri={item.photo_url} />
              <TextRegular style={styles.markerText}>${item.consultation_price}</TextRegular>
            </View>
          </Marker>
        ))}
      </MapView> */}
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
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
  },
  locateBtn: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});

export default DoctorMap;
