import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Control,
  useWatch,
  useFormState,
  useController,
  Path,
  FieldValues,
} from "react-hook-form";
import { TextRegular, TextSemiBold } from "../StyledText";
import Colors from "@/constants/Colors";
import ControllerTimePicker from "./ControllerTimePicker";
import { useTranslation } from "react-i18next";
import IconButton from "../IconButton";

const BUTTON_SIZE = 28;

interface ControllerAvailabilityProps<TFieldValues extends FieldValues> {
  label: string;
  control: Control;
  name: Path<TFieldValues>; // e.g. "availableTimeSlots"
}

const ControllerAvailability = <TFieldValues extends FieldValues>({
  label,
  control,
  name,
}: ControllerAvailabilityProps<TFieldValues>) => {
  const { t } = useTranslation();

  const { field } = useController({
    control,
    name,
  });

  const availableTimeSlots: {
    [day: string]: string[]; // Array of start times for each day
  } = useWatch({ control, name }) ?? {};

  const handleAddSlot = (day: string) => {
    const currentSlots = availableTimeSlots?.[day] ?? [];
    const updated = {
      ...availableTimeSlots,
      [day]: [...currentSlots, { start: "", end: "" }],
    };
    field.onChange(updated);
  };

  const handleRemoveSlot = (day: string, index: number) => {
    const currentSlots = availableTimeSlots?.[day] ?? [];
    const updated = {
      ...availableTimeSlots,
      [day]: currentSlots.filter((_, i) => i !== index),
    };
    field.onChange(updated);
  };

  return (
    <View>
      <View style={styles.labelContainer}>
        <TextRegular style={styles.label}>{label}</TextRegular>
      </View>

      {Object.entries(availableTimeSlots ?? {}).map(([day, timeSlots]) => (
        <View key={day} style={styles.dayContainer}>
          <View style={styles.timeSlotRow}>
            <TextRegular style={styles.dayLabel}>{day}</TextRegular>

            {timeSlots.length > 0 ? (
              <View style={styles.inlineSlot}>
                <ControllerTimePicker
                  name={`${name}.${day}.0.start` as Path<TFieldValues>}
                  placeholder={t("form.start-time")}
                  control={control}
                  rules={{ required: t("form.start-time-is-required") }}
                />
                <TextSemiBold>-</TextSemiBold>
                <ControllerTimePicker
                  name={`${name}.${day}.0.end` as Path<TFieldValues>}
                  placeholder={t("form.end-time")}
                  control={control}
                  rules={{ required: t("form.end-time-is-required") }}
                />
              </View>
            ) : (
              <TextRegular style={styles.noSlotsText}>
                {t("form.no-availability")}
              </TextRegular>
            )}

            <View style={styles.buttonRow}>
              {timeSlots.length > 0 ? (
                <IconButton
                  name="close"
                  size={BUTTON_SIZE}
                  onPress={() => handleRemoveSlot(day, 0)}
                />
              ) : (
                <View style={styles.empty} />
              )}
              <IconButton
                name="add"
                size={BUTTON_SIZE}
                onPress={() => handleAddSlot(day)}
              />
            </View>
          </View>

          {/* Remaining slots */}
          {timeSlots.slice(1).map((_, index) => (
            <View
              key={`${day}_${index + 1}`}
              style={[styles.timeSlotRow, { paddingLeft: 40 }]}
            >
              <View style={styles.inlineSlot}>
                <ControllerTimePicker
                  name={
                    `${name}.${day}.${index + 1}.start` as Path<TFieldValues>
                  }
                  placeholder={t("form.start-time")}
                  control={control}
                  rules={{ required: t("form.start-time-is-required") }}
                />
                <TextRegular style={{ fontSize: 16 }}>-</TextRegular>
                <ControllerTimePicker
                  name={`${name}.${day}.${index + 1}.end` as Path<TFieldValues>}
                  placeholder={t("form.end-time")}
                  control={control}
                  rules={{ required: t("form.end-time-is-required") }}
                />
              </View>
              <View style={styles.buttonRow}>
                <IconButton
                  name="close"
                  size={BUTTON_SIZE}
                  onPress={() => handleRemoveSlot(day, index + 1)}
                />
                <View style={styles.empty} />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ControllerAvailability;

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
    marginBottom: 6,
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
