import React, { useEffect, useMemo } from "react";
import { ContextMenu, Picker } from "@expo/ui/swift-ui";
import { View, StyleSheet } from "react-native";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { TextRegular } from "../StyledText";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface Option {
  value: string;
  label: string;
}

interface ControllerContextMenuProps<TFieldValues extends FieldValues> {
  label: string;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  options: (string | Option)[];
}

// Need to handle android
const ControllerContextMenu = <TFieldValues extends FieldValues>({
  label,
  control,
  rules = {},
  name,
  options,
}: ControllerContextMenuProps<TFieldValues>) => {
  if (!options || options.length === 0) {
    throw new Error("ControllerContextMenu requires at least one option.");
  }

  // Normalize options to { value, label }
  const normalizedOptions: Option[] = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === "string"
          ? { value: opt, label: opt }
          : { value: opt.value, label: opt.label }
      ),
    [options]
  );

  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Find the current index based on the field value
        const selectedIndex = useMemo(
          () =>
            normalizedOptions.findIndex(
              (opt) => opt.value === value.toString()
            ),
          [normalizedOptions, value]
        );

        // Default to the first option
        useEffect(() => {
          if (!value && normalizedOptions.length > 0) {
            onChange(normalizedOptions[0].value.toString());
          }
        }, [value, normalizedOptions, onChange]);

        return (
          <View>
            <View style={styles.labelContainer}>
              <TextRegular style={styles.label}>{label}</TextRegular>
              {error?.message && (
                <TextRegular style={styles.error}>{error.message}</TextRegular>
              )}
            </View>

            <ContextMenu
              activationMethod="singlePress"
              style={styles.contextMenu}
            >
              <ContextMenu.Items>
                <Picker
                  label={label}
                  options={normalizedOptions.map((opt) => opt.label)}
                  variant="inline"
                  selectedIndex={selectedIndex >= 0 ? selectedIndex : 0}
                  onOptionSelected={({ nativeEvent: { index } }) => {
                    const selected = normalizedOptions[index];
                    onChange(selected.value);
                  }}
                />
              </ContextMenu.Items>

              <ContextMenu.Trigger>
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: error ? Colors.pink : Colors.faintGrey },
                  ]}
                >
                  <TextRegular
                    style={[
                      styles.input,
                      { color: value ? Colors.black : Colors.lightText },
                    ]}
                  >
                    {
                      normalizedOptions.find(
                        (opt) => opt.value === value.toString()
                      )?.label
                    }
                  </TextRegular>
                  <Ionicons name="chevron-down" size={20} color={Colors.grey} />
                </View>
              </ContextMenu.Trigger>
            </ContextMenu>
          </View>
        );
      }}
    />
  );
};

export default ControllerContextMenu;

const styles = StyleSheet.create({
  contextMenu: {
    width: 150,
    height: 50,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
    marginRight: 8,
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
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    paddingVertical: 10,
    textAlignVertical: "top",
    textAlign: "left",
  },
});
