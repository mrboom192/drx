import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Control,
  useFieldArray,
  useFormContext,
  Path,
  FieldValues,
  ArrayPath,
} from "react-hook-form";
import { TextRegular, TextSemiBold } from "../StyledText";
import Colors from "@/constants/Colors";
import ControllerTimePicker from "./ControllerTimePicker";
import { useTranslation } from "react-i18next";
import IconButton from "../IconButton";

const BUTTON_SIZE = 28;

interface ControllerAvailabilityProps<TFieldValues extends FieldValues> {
  label: string;
  control: Control<any>;
  name: Path<TFieldValues>; // e.g., "availability"
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ControllerAvailability = <TFieldValues extends FieldValues>({
  label,
  control,
  name,
}: ControllerAvailabilityProps<TFieldValues>) => {
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.labelContainer}>
        <TextRegular style={styles.label}>{label}</TextRegular>
      </View>

      {WEEK_DAYS.map((day) => {
        const dayName = `${name}.${day}` as const;
        const { fields, append, remove } = useFieldArray({
          control,
          name: dayName as any,
        });

        return (
          <View key={day} style={styles.dayContainer}>
            {fields.length === 0 ? (
              <View style={styles.timeSlotRow}>
                <TextRegular style={styles.dayLabel}>{day}</TextRegular>
                <TextRegular style={styles.noSlotsText}>
                  {"Unavailable"}
                </TextRegular>
                <View style={styles.buttonRow}>
                  <View style={styles.empty} />
                  <IconButton
                    name="add"
                    size={BUTTON_SIZE}
                    onPress={() => append({ start: "", end: "" })}
                  />
                </View>
              </View>
            ) : (
              fields.map((field, index) => (
                <View key={field.id} style={[styles.timeSlotRow]}>
                  {index === 0 ? (
                    <TextRegular style={styles.dayLabel}>{day}</TextRegular>
                  ) : (
                    <View style={styles.dayLabel} />
                  )}
                  <View style={styles.inlineSlot}>
                    <ControllerTimePicker
                      name={`${dayName}.${index}.start` as Path<TFieldValues>}
                      placeholder={t("form.start-time")}
                      control={control}
                      rules={{ required: t("form.start-time-is-required") }}
                    />
                    <TextSemiBold>-</TextSemiBold>
                    <ControllerTimePicker
                      name={`${dayName}.${index}.end` as Path<TFieldValues>}
                      placeholder={t("form.end-time")}
                      control={control}
                      rules={{ required: t("form.end-time-is-required") }}
                    />
                  </View>
                  <View style={styles.buttonRow}>
                    <IconButton
                      name="close"
                      size={BUTTON_SIZE}
                      onPress={() => remove(index)}
                    />
                    {index === 0 ? (
                      <IconButton
                        name="add"
                        size={BUTTON_SIZE}
                        onPress={() => append({ start: "", end: "" })}
                      />
                    ) : (
                      <View style={styles.empty} />
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        );
      })}
    </View>
  );
};

export default ControllerAvailability;

export const getMinutesFromTime = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const styles = StyleSheet.create({
  empty: {
    width: BUTTON_SIZE,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  dayContainer: {
    flexDirection: "column",
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 14,
    color: Colors.black,
    width: 40,
  },
  inlineSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  timeSlotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 64,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 8,
  },
  noSlotsText: {
    fontSize: 14,
    color: Colors.lightText,
    flex: 1,
    fontStyle: "italic",
  },
});
