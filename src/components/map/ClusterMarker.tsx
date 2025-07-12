import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { TextSemiBold } from "../StyledText";
import Colors from "@/constants/Colors";
import { Marker } from "react-native-maps";

const ClusterMarker = ({
  identifier,
  coordinate,
  count,
}: {
  identifier: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  count: number;
}) => {
  return (
    <Marker
      identifier={identifier} // Becomes nativeEvent.id
      coordinate={coordinate}
      style={style.marker}
      pointerEvents="none"
    >
      <View style={style.bubble}>
        <TextSemiBold style={style.count}>{count}</TextSemiBold>
      </View>
    </Marker>
  );
};

const style = StyleSheet.create({
  marker: {
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  bubble: {
    width: 40,
    height: 40,
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    padding: 4,
    borderRadius: 999,
    borderColor: Colors.faintGrey,
    borderWidth: 1,
  },
  count: {
    color: Colors.black,
    fontSize: 16,
  },
});

export default ClusterMarker;
