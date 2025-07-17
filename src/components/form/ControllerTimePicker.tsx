import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { TextRegular } from "../StyledText";
import i18next from "i18next";
import { locales } from "@/constants/locales";

const ControllerTimePicker = ({
  control,
  name,
  rules = {},
  label,
  disabled = false,
  placeholder = "Select Time",
}: {
  control: Control;
  name: string;
  rules?: any;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        //Convert {hour, minute} into a Date objectq
        const dateValue = value
          ? new Date(0, 0, 0, value.hour, value.minute)
          : new Date();
        const displayValue = dateValue
          ? format(dateValue, "h:mm a", { locale: locales[i18next.language] })
          : "";

        return (
          <View style={styles.container}>
            <View style={styles.labelContainer}>
              {label && <TextRegular style={styles.label}>{label}</TextRegular>}
              {error && (
                <TextRegular style={styles.error}>{error?.message}</TextRegular>
              )}
            </View>

            <Pressable
              onPress={() => !disabled && setShowTimePicker(true)}
              style={[
                styles.inputContainer,
                { borderColor: error ? Colors.pink : Colors.faintGrey },
              ]}
            >
              <TextRegular style={{ color: value ? "#000" : Colors.lightText }}>
                {value ? displayValue : placeholder}
              </TextRegular>
              <Ionicons name="time-outline" size={20} color={Colors.grey} />
            </Pressable>

            <DatePicker
              locale={i18next.language}
              modal
              mode="time"
              open={showTimePicker}
              date={dateValue}
              onConfirm={(date) => {
                setShowTimePicker(false);
                onChange({
                  hour: date.getHours(),
                  minute: date.getMinutes(),
                });
              }}
              onCancel={() => setShowTimePicker(false)}
            />
          </View>
        );
      }}
    />
  );
};

export default ControllerTimePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    justifyContent: "space-between",
  },
});
