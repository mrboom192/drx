import React, { useCallback, useState } from "react";

import Colors from "@/constants/Colors";
import { useAppointments } from "@/stores/useAppointmentStore";
import { getDayHeight, getDayWidth } from "@/utils/calendarUtils";
import { format } from "date-fns";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { Direction } from "react-native-calendars/src/types";
import DatePicker from "react-native-date-picker";
import Avatar from "../Avatar";
import IconButton from "../IconButton";
import { TextSemiBold } from "../StyledText";
import CustomIcon from "../icons/CustomIcon";

const DoctorCalendar = () => {
  const appointments = useAppointments();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd") // Default to today's date
  );
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(format(selectedDate, "yyyy-MM-dd"));
    }
  };

  const onLayout = (event: { nativeEvent: { layout: { height: any } } }) => {
    const { height } = event.nativeEvent.layout;
    setCalendarHeight(height);
  };

  // Handle day press
  const onDayPress = useCallback((date?: DateData | undefined) => {
    if (!date) return;

    setSelectedDate(date.dateString);
    router.push({
      pathname: "/(protected)/(modals)/[date]",
      params: { date: date.dateString },
    });
  }, []);

  // Custom arrow for the calendar
  const renderArrow = (direction: Direction) => {
    return (
      <IconButton
        name={direction === "right" ? "chevron-right" : "chevron-left"}
        pointerEvents="none"
      />
    );
  };

  // Custom header for the calendar
  const renderHeader = (date: string) => {
    return (
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
    );
  };

  // Custom day component for the calendar
  const renderDay = useCallback(
    ({ date, state }: DayProps & { date?: DateData | undefined }) => {
      if (state === "disabled") return null;

      const isToday = state === "today";
      const calendarDate = date?.dateString;

      // Filter today's appointments once
      const todaysAppointments = appointments.filter((appointment: any) => {
        const appointmentDate = format(appointment.date.toDate(), "yyyy-MM-dd");
        return appointmentDate === calendarDate;
      });

      return (
        <TouchableOpacity
          style={{
            width: getDayWidth(),
            height: getDayHeight(calendarHeight),
            alignItems: "center",
            justifyContent: "flex-end",
            flexDirection: "column",
            gap: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: isToday ? "black" : Colors.lightGrey,
            borderRadius: 8,
            overflow: "hidden",
          }}
          onPress={() => onDayPress(date)}
        >
          <View style={{ flexDirection: "column", gap: 2 }}>
            {todaysAppointments.map((appointment) => (
              <Avatar
                key={appointment.id}
                size={24}
                uri={appointment.patient.image}
                pointerEvents="none"
              />
            ))}
          </View>
          <TextSemiBold
            style={{
              textAlign: "center",
              color: isToday ? "#FFF" : Colors.grey,
            }}
          >
            {date?.day}
          </TextSemiBold>
        </TouchableOpacity>
      );
    },
    [selectedDate]
  );

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <Calendar
        key={selectedDate}
        disableAllTouchEventsForDisabledDays
        renderArrow={renderArrow}
        renderHeader={renderHeader}
        dayComponent={renderDay}
        current={selectedDate}
        theme={{
          backgroundColor: "transparent",
          textDayHeaderFontFamily: "DMSans_600SemiBold",
        }}
        style={{
          height: "100%",
          backgroundColor: "transparent",
        }}
      />
      <DatePicker
        modal
        mode="date"
        open={showDatePicker}
        date={new Date(selectedDate)}
        onConfirm={(date) => {
          setShowDatePicker(false);
          setSelectedDate(format(date, "yyyy-MM-dd"));
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />
    </View>
  );
};

export default DoctorCalendar;
