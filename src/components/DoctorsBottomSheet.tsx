import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Doctor } from "@/types/doctor";
import DoctorList from "./DoctorList";

interface Props {
  doctors: Doctor[];
  specialty: string;
}

const DoctorsBottomSheet = ({ doctors, specialty }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();
  const [refresh, setRefresh] = useState(0);
  const snapPoints = useMemo(() => ["4%", "100%"], []);

  const showMap = () => {
    bottomSheetRef.current?.collapse(); // Collapses bottom sheet, showing map
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
      <View style={{ flex: 1 }}>
        <DoctorList doctors={doctors} specialty={specialty} refresh={refresh} />
        <View style={styles.absoluteView}>
          <TouchableOpacity onPress={showMap} style={styles.btn}>
            <Text style={{ fontFamily: "dm-sb", color: "#FFF" }}>Map</Text>
            <Ionicons name="map" size={20} color={"#FFF"} />
          </TouchableOpacity>
        </View>
      </View>
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
});

export default DoctorsBottomSheet;
