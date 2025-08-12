import Colors from "@/constants/Colors";
import React from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextRegular } from "../StyledText";
import CustomIcon from "../CustomIcon";
import { TimeSlot } from "@/types/timeSlot";

interface Props {
  label: string;
  control: Control<any>;
  rules?: RegisterOptions;
  name: string;
  timeSlots?: TimeSlot[];
}

const ControllerTimeSlotOptions: React.FC<Props> = ({
  label,
  control,
  rules = {},
  name,
  timeSlots = [],
}) => {
  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedValues: string[] = [value ?? ""];

        const toggleOption = (optionValue: string) => {
          onChange(optionValue);
        };

        const isSelected = (optionValue: string) =>
          selectedValues[0] === optionValue;

        return (
          <View>
            <View style={styles.labelContainer}>
              <TextRegular style={styles.label}>{label}</TextRegular>
              <TextRegular style={styles.error}>{error?.message}</TextRegular>
            </View>

            <View style={styles.optionsContainer}>
              {timeSlots.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    {
                      borderColor: isSelected(option)
                        ? Colors.black
                        : Colors.faintGrey,
                    },
                  ]}
                  onPress={() => toggleOption(option)}
                >
                  <CustomIcon
                    name={
                      isSelected(option)
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={16}
                    color={Colors.black}
                  />
                  <TextRegular style={styles.optionValue}>
                    {new Date(option).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TextRegular>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      }}
    />
  );
};

export default ControllerTimeSlotOptions;

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
    fontSize: 14,
  },
  optionsContainer: {
    flexDirection: "column",
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 4,
  },
  optionValue: {
    fontSize: 16,
  },
});
