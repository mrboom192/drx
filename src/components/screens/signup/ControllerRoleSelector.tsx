import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const ControllerRoleSelector = ({
  control,
  name,
  rules = {},
  disabled = false,
}: {
  control: Control;
  name: string;
  rules?: any;
  disabled?: boolean;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, formState: { errors } }) => {
        const error = errors[name]?.message as string | undefined;

        return (
          <>
            <View
              style={[
                styles.container,
                { borderColor: error ? Colors.pink : Colors.light.faintGrey },
              ]}
            >
              {["Patient", "Doctor"].map((option) => {
                const lowerCaseOption = option.toLowerCase() as
                  | "patient"
                  | "doctor";
                const isSelected = value === lowerCaseOption;
                return (
                  <TouchableOpacity
                    key={option}
                    disabled={disabled}
                    onPress={() => onChange(lowerCaseOption)}
                    style={[
                      styles.option,
                      {
                        backgroundColor: isSelected ? "#8854D0" : "transparent",
                      },
                    ]}
                  >
                    <TextSemiBold
                      style={{ color: isSelected ? "#fff" : "#000" }}
                    >
                      {option}
                    </TextSemiBold>
                  </TouchableOpacity>
                );
              })}
            </View>
            {error && <TextSemiBold style={styles.error}>{error}</TextSemiBold>}
          </>
        );
      }}
    />
  );
};

export default ControllerRoleSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 100,
    padding: 4,
    marginBottom: 24,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
  },
  error: {
    color: Colors.pink,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});
