import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import CustomIcon from "../icons/CustomIcon";
import { IconName } from "../icons/iconsMap";
import { TextRegular } from "../StyledText";

const ControllerInput = ({
  label,
  placeholder,
  control,
  rules = {},
  name,
  sensitive = false,
  multiline = false,
  textInputStyle = null,
  keyboardType = "default",
  iconLeft,
}: {
  label: string;
  placeholder: string;
  control: Control;
  rules?: any;
  name: string;
  sensitive?: boolean;
  multiline?: boolean;
  textInputStyle?: StyleProp<TextStyle>;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  iconLeft?: IconName;
}) => {
  const [showSensitive, setShowSensitive] = useState(false);

  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View>
          <View style={styles.labelContainer}>
            <TextRegular style={styles.label}>{label}</TextRegular>
            <TextRegular style={styles.error}>{error?.message}</TextRegular>
          </View>

          <View
            style={[
              styles.inputContainer,
              { borderColor: error ? Colors.pink : Colors.faintGrey },
            ]}
          >
            {iconLeft && (
              <View style={styles.iconLeftContainer}>
                <CustomIcon
                  name={iconLeft}
                  size={16}
                  color={Colors.lightText}
                />
              </View>
            )}
            <TextInput
              style={[styles.input, textInputStyle]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={Colors.lightText}
              secureTextEntry={sensitive && !showSensitive}
              multiline={multiline}
              keyboardType={keyboardType}
            />
            {sensitive && (
              <TouchableOpacity
                onPress={() => setShowSensitive(!showSensitive)}
              >
                <Ionicons
                  name={showSensitive ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.grey}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    />
  );
};

export default ControllerInput;

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  error: {
    color: Colors.pink,
    fontSize: 12,
  },
  iconLeftContainer: {
    marginRight: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    paddingVertical: 10,
  },
});
