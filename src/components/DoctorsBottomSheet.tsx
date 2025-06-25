import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import DoctorList from "./DoctorList/DoctorList";
import { TextSemiBold } from "./StyledText";

interface Props {
  specialty: string;
}

const DoctorsBottomSheet = ({ specialty }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [refresh, setRefresh] = useState(0);
  const snapPoints = useMemo(() => ["4%", "100%"], []);

  const showMap = () => {
    bottomSheetRef.current?.collapse(); // Collapses bottom sheet, showing map
    setRefresh((curr) => curr + 1);
  };

  return (
    <BottomSheet
      style={styles.sheetContainer}
      backgroundStyle={styles.bottomSheetBackground}
      snapPoints={snapPoints}
      index={2}
      ref={bottomSheetRef}
      handleIndicatorStyle={{ backgroundColor: Colors.light.grey }}
      enablePanDownToClose={false}
    >
      <View style={{ flex: 1 }}>
        <DoctorList specialty={specialty} refresh={refresh} />
        <MapButton onPress={showMap} />
      </View>
    </BottomSheet>
  );
};

const MapButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.absoluteView}>
      <TouchableOpacity onPress={onPress} style={styles.btn}>
        <TextSemiBold style={{ color: "#FFF" }}>Map</TextSemiBold>
        <Ionicons name="map" size={20} color={"#FFF"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  bottomSheetBackground: {
    borderRadius: 0,
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
});

export default DoctorsBottomSheet;
