import Colors from "@/constants/Colors";
import React from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextRegular } from "../StyledText";
import CustomIcon from "../icons/CustomIcon";

interface Props {
  label: string;
  control: Control<any>;
  rules?: RegisterOptions;
  name: string;
  options?: string[];
  singleSelect?: boolean; // 🔥 New prop
}

const ControllerCheckBoxOptions: React.FC<Props> = ({
  label,
  control,
  rules = {},
  name,
  options = [],
  singleSelect = false,
}) => {
  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedValues: string[] = singleSelect
          ? [value ?? ""] // For single select
          : value ?? [];

        const toggleOption = (option: string) => {
          if (singleSelect) {
            onChange(option); // 🔥 Set single value
          } else {
            const updatedValues = selectedValues.includes(option)
              ? selectedValues.filter((v) => v !== option)
              : [...selectedValues, option];
            onChange(updatedValues);
          }
        };

        const isSelected = (option: string) =>
          singleSelect
            ? selectedValues[0] === option
            : selectedValues.includes(option);

        return (
          <>
            <View style={styles.labelContainer}>
              <TextRegular style={styles.label}>{label}</TextRegular>
              <TextRegular style={styles.error}>{error?.message}</TextRegular>
            </View>

            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() => toggleOption(option)}
                >
                  <CustomIcon
                    name={
                      isSelected(option)
                        ? singleSelect
                          ? "radio-button-checked"
                          : "check-box"
                        : singleSelect
                        ? "radio-button-unchecked"
                        : "check-box-outline-blank"
                    }
                    size={16}
                    color={Colors.black}
                  />
                  <TextRegular style={styles.optionValue}>{option}</TextRegular>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
      }}
    />
  );
};

export default ControllerCheckBoxOptions;

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
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 4,
  },
  optionValue: {
    fontSize: 12,
  },
});
