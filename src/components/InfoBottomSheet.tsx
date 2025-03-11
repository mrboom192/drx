import { View, Pressable } from "react-native";
import React, { forwardRef, ReactNode, useCallback, useMemo } from "react";
import Colors from "@/constants/Colors";
import Close from "./icons/Close";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const InfoBottomSheet = forwardRef<BottomSheetModal, { content?: ReactNode }>(
  ({ content = <></> }, ref) => {
    const { themeBorderStyle, colorScheme } = useThemedStyles();
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
          backgroundColor:
            colorScheme === "light"
              ? Colors.light.background
              : Colors.dark.background,
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
            <Pressable
              onPress={() => ref!.current?.dismiss()}
              style={[themeBorderStyle, { padding: 4, borderRadius: 9999 }]}
            >
              <Close size={24} color={"#000"} />
            </Pressable>
          </View>
          {content}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default InfoBottomSheet;
