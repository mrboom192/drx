import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { TextRegular, TextSemiBold } from "../StyledText";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Control, Controller, FieldValues } from "react-hook-form";
import ControllerInput from "./ControllerInput";
import SubmitButton from "../SubmitButton";

const ControllerAddPhone = ({ control }: { control: Control<FieldValues> }) => {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["70%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    // Handle sheet changes
  }, []);

  return (
    <>
      <View style={styles.container}>
        <TextRegular style={styles.label}>{t("form.phone-number")}</TextRegular>
        <TouchableOpacity onPress={handlePresentModalPress}>
          <TextSemiBold style={styles.addButton}>Add</TextSemiBold>
        </TouchableOpacity>
      </View>

      <BottomSheetModal
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.25}
          />
        )}
        handleComponent={() => null}
        snapPoints={snapPoints}
        index={1}
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
      >
        <BottomSheetView
          style={{ flex: 1, marginHorizontal: 16, marginTop: 28 }}
        >
          <Controller
            control={control}
            name={"phoneNumber"}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error, isDirty },
            }) => (
              <>
                <TextRegular
                  style={{ marginBottom: 16, color: Colors.lightText }}
                >
                  We'll text you a code to verify your phone number. Standard
                  message and data rates apply.
                </TextRegular>
                <ControllerInput
                  label={t("form.phone-number")}
                  control={control}
                  name={"phoneNumber"}
                  placeholder={t("form.e-g-1234567890")}
                  keyboardType={"phone-pad"}
                  autoFocus
                />
                <SubmitButton
                  text={"Verify"}
                  style={{ marginTop: 16 }}
                  disabled={!isDirty}
                  onPress={() => {}}
                />
              </>
            )}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default ControllerAddPhone;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  addButton: {
    fontSize: 14,
    color: Colors.black,
    textDecorationLine: "underline",
  },
});
