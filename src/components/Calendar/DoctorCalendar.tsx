import React, { useCallback, useState } from "react";

import Colors from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { router } from "expo-router";
import { Dimensions, Platform, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { Direction } from "react-native-calendars/src/types";
import IconButton from "../IconButton";
import { TextSemiBold } from "../StyledText";
import CustomIcon from "../icons/CustomIcon";

const DoctorCalendar = ({ consultations }: any) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const onDayPress = useCallback((date?: DateData | undefined) => {
    if (!date) return;

    setSelectedDate(date.dateString);
    router.push({
      pathname: "/(protected)/(modals)/[date]",
      params: { date: date.dateString },
    });
  }, []);

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
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        // Update the selected date here
        console.log("Selected date:", selectedDate);
      }
    };

    return (
      <>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
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
        {showDatePicker && (
          <DateTimePicker
            value={new Date(date)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}
      </>
    );
  };

  const renderDay = ({
    date,
    state,
  }: DayProps & { date?: DateData | undefined }) => {
    if (state === "disabled") return null;

    const isToday = state === "today";

    return (
      <TouchableOpacity
        style={{
          width: getDayWidth(), // Hacky fix
          height: 122, // Need to implement a better way to get the height
          alignItems: "center",
          justifyContent: "flex-end",
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: isToday ? "black" : Colors.lightGrey,
          borderRadius: 8,
        }}
        onPress={() => onDayPress(date)}
      >
        <TextSemiBold
          style={{
            textAlign: "center",
            color: isToday ? "#FFF" : Colors.grey,
          }}
        >
          {date?.day ?? "–"}
        </TextSemiBold>
      </TouchableOpacity>
    );
  };

  return (
    <Calendar
      renderArrow={renderArrow}
      renderHeader={renderHeader}
      dayComponent={renderDay}
      current={selectedDate}
      markedDates={{
        [selectedDate]: { selected: true, selectedColor: "#6366f1" },
        // Mark dates with consultations
        // ...Object.keys(consultations).reduce(
        //   (acc, date) => ({
        //     ...acc,
        //     [date]: { marked: true, dotColor: "#6366f1" },
        //   }),
        //   {}
        // ),
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

const getDayWidth = () => {
  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = 32;
  const totalGapBetweenDays = 6 * 4; // 6 gaps between 7 days
  const availableWidth = screenWidth - horizontalPadding - totalGapBetweenDays;
  return availableWidth / 7;
};

const getDayHeight = (calendarHeight: number) => {
  const verticalPadding = 32; // e.g., 16 top + 16 bottom
  const totalGapBetweenRows = 4 * 4; // 4 gaps between 5 rows
  const availableHeight =
    calendarHeight - verticalPadding - totalGapBetweenRows;
  return availableHeight / 5;
};
