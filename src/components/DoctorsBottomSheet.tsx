import { View, StyleSheet } from "react-native";
import React, { Ref, useMemo } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import DoctorList from "./DoctorList/DoctorList";

const DoctorsBottomSheet = ({
  bottomSheetRef,
  refresh,
}: {
  bottomSheetRef: Ref<BottomSheet>;
  refresh: number;
}) => {
  const snapPoints = useMemo(() => ["4%", "100%"], []);

  return (
    <BottomSheet
      animateOnMount={false}
      style={styles.sheetContainer}
      backgroundStyle={styles.bottomSheetBackground}
      snapPoints={snapPoints}
      index={2}
      ref={bottomSheetRef}
      handleIndicatorStyle={{ backgroundColor: Colors.light.grey }}
      enablePanDownToClose={false}
    >
      <View style={{ flex: 1 }}>
        <DoctorList refresh={refresh} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  bottomSheetBackground: {
    borderRadius: 0,
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
