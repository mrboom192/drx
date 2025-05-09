import React from "react";

import Colors from "@/constants/Colors";
import { format } from "date-fns";
import { Text, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { Direction } from "react-native-calendars/src/types";
import IconButton from "../IconButton";
import { TextSemiBold } from "../StyledText";
import CustomIcon from "../icons/CustomIcon";

const DoctorCalendar = ({
  selectedDate,
  setSelectedDate,
  consultations,
}: any) => {
  const renderArrow = (direction: Direction) => {
    return (
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
          borderWidth: 1,
          borderColor: Colors.lightGrey2,
        }}
      >
        <IconButton
          name={direction === "right" ? "chevron-right" : "chevron-left"}
        />
      </TouchableOpacity>
    );
  };

  const renderHeader = (date: string) => {
    return (
      <TouchableOpacity
        style={{
          paddingHorizontal: 24,
          height: 40,
          borderRadius: 9999,
          borderWidth: 1,
          borderColor: Colors.lightGrey2,
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomIcon name="calendar" size={24} color="#000" />
        <TextSemiBold
          style={{
            fontSize: 16,
            color: "#000",
            textAlign: "center",
          }}
        >
          {format(date, "LLLL, yyyy")}
        </TextSemiBold>
      </TouchableOpacity>
    );
  };

  const renderDay = ({ date, state }: { date?: DateData } & DayProps) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: state === "selected" ? "black" : Colors.lightGrey,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: state === "disabled" ? "gray" : "black",
          }}
        >
          {date ? date.day : "Error"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Calendar
      renderArrow={renderArrow}
      renderHeader={renderHeader}
      onDayPress={(day: DateData) => {
        console.log(day);
        setSelectedDate("RAN");
      }}
      dayComponent={renderDay}
      markedDates={{
        [selectedDate]: { selected: true, selectedColor: "#6366f1" },
        // Mark dates with consultations
        ...Object.keys(consultations).reduce(
          (acc, date) => ({
            ...acc,
            [date]: { marked: true, dotColor: "#6366f1" },
          }),
          {}
        ),
      }}
      theme={{
        backgroundColor: "transparent",
        todayTextColor: "#6366f1",
        selectedDayBackgroundColor: "#6366f1",
        arrowColor: "#6366f1",
      }}
      style={{
        // flex: 1,
        height: "100%",
        backgroundColor: "transparent",
      }}
    />
  );
};

export default DoctorCalendar;
