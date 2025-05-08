import Colors from "@/constants/Colors";
import React from "react";
import { Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

const DoctorCalendar = ({
  selectedDate,
  setSelectedDate,
  consultations,
}: any) => {
  return (
    <Calendar
      onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
      dayComponent={({ date, state }) => {
        return (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              padding: 16,
              backgroundColor:
                state === "selected" ? "black" : Colors.lightGrey,
              height: "85",
              alignContent: "flex-start",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: state === "disabled" ? "gray" : "black",
              }}
            >
              {date ? date.day : ""}
            </Text>
          </View>
        );
      }}
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
        todayTextColor: "#6366f1",
        selectedDayBackgroundColor: "#6366f1",
        arrowColor: "#6366f1",
      }}
      style={{
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        backgroundColor: "#fff",
        marginBottom: 20,
      }}
    />
  );
};

export default DoctorCalendar;
