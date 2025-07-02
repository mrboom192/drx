import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import CustomIcon from "../CustomIcon";
import { IconName } from "../../constants/iconsMap";
import { TextRegular } from "../StyledText";
import i18next from "i18next";
import MaskInput from "react-native-mask-input";
import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";
import { useTranslation } from "react-i18next";

interface ControllerPhoneInputProps<TFieldValues extends FieldValues> {
  label: string;
  placeholder: string;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  /**  Set to `true` if you want eye/eye-off toggle (e.g. PIN). */
  sensitive?: boolean;
  textInputStyle?: StyleProp<TextStyle>;
  /** ISO-3166 country code for validation; default “US”. */
  region?: CountryCode;
  iconLeft?: IconName;
  autoFocus?: boolean;
}

const ControllerPhoneInput = <TFieldValues extends FieldValues>({
  placeholder,
  control,
  rules = {},
  name,
  textInputStyle = null,
  region = "US",
  autoFocus = false,
}: ControllerPhoneInputProps<TFieldValues>) => {
  const { t } = useTranslation();
  const [isValid] = useState<boolean | null>(null);

  return (
    <Controller
      control={control}
      rules={{
        ...rules,
        validate: (val) => {
          const phone = parsePhoneNumberFromString(val, region);
          return phone?.isValid() || "Invalid phone number";
        },
      }}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View>
          {/* label + error */}
          <View style={styles.labelContainer}>
            <TextRegular style={styles.label}>
              {t("form.phone-number")}
            </TextRegular>
            <TextRegular style={styles.error}>{error?.message}</TextRegular>
          </View>

          {/* input wrapper */}
          <View
            style={[
              styles.inputContainer,
              {
                borderColor:
                  error || isValid === false ? Colors.pink : Colors.faintGrey,
              },
            ]}
          >
            <MaskInput
              autoFocus={autoFocus}
              keyboardType="phone-pad"
              placeholder={placeholder}
              mask={[
                "(",
                /\d/,
                /\d/,
                /\d/,
                ") ",
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              style={[
                styles.input,
                {
                  textAlign: i18next.dir() === "rtl" ? "right" : "left",
                  writingDirection: i18next.dir() === "rtl" ? "rtl" : "ltr",
                },
                textInputStyle,
              ]}
              value={value}
              onBlur={onBlur}
              onChangeText={(masked, unmasked) => {
                onChange(unmasked); // store raw digits in RHF
              }}
            />
          </View>
        </View>
      )}
    />
  );
};

export default ControllerPhoneInput;

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  error: {
    fontSize: 12,
    color: Colors.pink,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  iconLeftContainer: {
    marginLeft: 16,
  },
  iconRightContainer: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    fontFamily: "DMSans_400Regular",
  },
});
