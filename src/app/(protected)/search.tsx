import DoctorList from "@/components/DoctorList/DoctorList";
import DoctorMap from "@/components/DoctorMap";
import DoctorsBottomSheet from "@/components/DoctorsBottomSheet";
import DoctorsHeader from "@/components/DoctorsHeader";
import MapButton from "@/components/map/MapButton";
import { TextRegular } from "@/components/StyledText";
import { useFetchSomeDoctors } from "@/stores/useDoctorSearch";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";

const Page = () => {
  const fetchSomeDoctors = useFetchSomeDoctors();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [refresh, setRefresh] = useState(0);
  const [mapVisible, setMapVisible] = useState(false);

  const showMap = () => {
    if (!mapVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.collapse();
    }
    setMapVisible((prev) => !prev);
    setRefresh((curr) => curr + 1);
  };

  useEffect(() => {
    fetchSomeDoctors();
  }, []);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <Stack.Screen
        options={{
          header: () => <DoctorsHeader />,
        }}
      />
      <MapButton onPress={showMap} />
      <DoctorMap />
      <DoctorsBottomSheet bottomSheetRef={bottomSheetRef} refresh={refresh} />
    </View>
  );
};

export default Page;
