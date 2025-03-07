import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import Colors from "@/constants/Colors";

interface Props {}

const InfoBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({}: Props, ref) => {
    const colorScheme = useColorScheme();
    const snapPoints = useMemo(() => ["50%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={0}
          appearsOnIndex={1}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
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
        ref={ref}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: Colors.light.grey }}
        enablePanDownToClose={true}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <Text style={{ fontFamily: "dm-sb", color: "#FFF" }}>INFO</Text>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

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
    borderRadius: 16,
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

export default InfoBottomSheet;
