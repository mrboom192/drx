import Colors from "@/constants/Colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, ReactNode, useCallback, useMemo } from "react";
import { View } from "react-native";
import IconButton from "./IconButton";

const InfoBottomSheet = forwardRef<BottomSheetModal, { content?: ReactNode }>(
  ({ content = <></> }, ref) => {
    const snapPoints = useMemo(() => ["65%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={1}
          opacity={0.3}
        />
      ),
      []
    );

    if (!ref) {
      console.error("Ref is not defined");
      return null;
    }

    return (
      <BottomSheetModal
        style={{
          borderRadius: 999,
          elevation: 4,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: {
            width: 1,
            height: 1,
          },
        }}
        backgroundStyle={{
          backgroundColor: Colors.light.background,
        }}
        snapPoints={snapPoints}
        index={1}
        ref={ref}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ height: 0 }}
        enablePanDownToClose={true}
      >
        <BottomSheetView style={{ flex: 1, alignItems: "center" }}>
          {/* Header-ish */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingHorizontal: 16,
            }}
          >
            <IconButton
              onPress={() => {
                if ("current" in ref && ref.current) {
                  ref.current.dismiss();
                }
              }}
              name="close"
            />
          </View>
          {content}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default InfoBottomSheet;
