import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Control,
  useFieldArray,
  Path,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TextRegular, TextSemiBold } from "../StyledText";
import Colors from "@/constants/Colors";
import { getCalendars } from "expo-localization";
import ControllerTimePicker from "./ControllerTimePicker";
import { useTranslation } from "react-i18next";
import IconButton from "../IconButton";

const BUTTON_SIZE = 28;

interface ControllerAvailabilityProps<TFieldValues extends FieldValues> {
  label: string;
  control: Control<any>;
  name: Path<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
}

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_DAYS_MAP: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

const newTimeSlot = {
  start: null,
  end: null,
};

const ControllerAvailability = <TFieldValues extends FieldValues>({
  label,
  control,
  name,
  setValue,
  watch,
}: ControllerAvailabilityProps<TFieldValues>) => {
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.labelContainer}>
        <TextRegular style={styles.label}>{label}</TextRegular>
        <View style={styles.timeZoneContainer}>
          <TextRegular style={styles.timeZone}>
            {watch("timeZone" as Path<TFieldValues>)}
          </TextRegular>
          <IconButton
            name="sync"
            size={BUTTON_SIZE}
            onPress={() => {
              const timeZone = getCalendars()[0].timeZone;
              if (!timeZone) return;
              setValue("timeZone" as Path<TFieldValues>, timeZone as any, {
                shouldDirty: true,
              });
            }}
          />
        </View>
      </View>

      {WEEK.map((day, dayIdx) => {
        // availability.day
        const formName = `${name}.${dayIdx}` as const;
        const dayName = WEEK[dayIdx];
        const { fields, append, remove } = useFieldArray({
          control,
          name: formName as any,
        });

        return (
          <View key={day} style={styles.dayContainer}>
            {fields.length === 0 ? (
              <View style={styles.timeSlotRow}>
                <TextRegular style={styles.dayLabel}>
                  {t(`weekdays.${dayName}`)}
                </TextRegular>
                <TextRegular style={styles.noSlotsText}>
                  {t("form.unavailable")}
                </TextRegular>
                <View style={styles.buttonRow}>
                  <View style={styles.empty} />
                  <IconButton
                    name="add"
                    size={BUTTON_SIZE}
                    onPress={() => append(newTimeSlot)}
                  />
                </View>
              </View>
            ) : (
              fields.map((field, timeSlotIdx) => (
                <View key={field.id} style={[styles.timeSlotRow]}>
                  {timeSlotIdx === 0 ? (
                    <TextRegular style={styles.dayLabel}>
                      {t(`weekdays.${dayName}`)}
                    </TextRegular>
                  ) : (
                    <View style={styles.dayLabel} />
                  )}
                  <View style={styles.inlineSlot}>
                    <ControllerTimePicker
                      name={
                        `${formName}.${timeSlotIdx}.start` as Path<TFieldValues>
                      }
                      placeholder={t("form.start-time")}
                      control={control}
                      rules={{ required: t("form.start-time-is-required") }}
                    />
                    <TextSemiBold>-</TextSemiBold>
                    <ControllerTimePicker
                      name={
                        `${formName}.${timeSlotIdx}.end` as Path<TFieldValues>
                      }
                      placeholder={t("form.end-time")}
                      control={control}
                      rules={{ required: t("form.end-time-is-required") }}
                    />
                  </View>
                  <View style={styles.buttonRow}>
                    <IconButton
                      name="close"
                      size={BUTTON_SIZE}
                      onPress={() => remove(timeSlotIdx)}
                    />
                    {timeSlotIdx === 0 ? (
                      <IconButton
                        name="add"
                        size={BUTTON_SIZE}
                        onPress={() => append(newTimeSlot)}
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

const styles = StyleSheet.create({
  empty: {
    width: BUTTON_SIZE,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  timeZoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeZone: {
    fontSize: 14,
    color: Colors.lightText,
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
