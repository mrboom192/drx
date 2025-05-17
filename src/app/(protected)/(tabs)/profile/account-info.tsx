import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useUserData } from "@/stores/useUserStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import {
  AsYouType,
  CountryCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db } from "../../../../../firebaseConfig";

const AccountInfo = () => {
  const userData = useUserData();

  if (!userData) return null;

  const original = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone || "",
    dateOfBirth: userData.dateOfBirth
      ? userData.dateOfBirth instanceof Timestamp
        ? userData.dateOfBirth.toDate()
        : userData.dateOfBirth
      : new Date(),
    gender:
      userData.gender === "male" || userData.gender === "female"
        ? userData.gender
        : "",
  };

  const [firstName, setFirstName] = useState(original.firstName);
  const [lastName, setLastName] = useState(original.lastName);
  const [phoneNumber, setPhoneNumber] = useState(original.phone); // Full E.164 format
  const [dateOfBirth, setDateOfBirth] = useState(original.dateOfBirth);
  const [gender, setGender] = useState(original.gender);
  const insets = useSafeAreaInsets();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [callingCode, setCallingCode] = useState(() => {
    const match = original.phone?.match(/^\+(\d{1,4})/);
    return match ? match[1] : "1";
  });
  const [countryCode, setCountryCode] = useState("US");
  const [countryFlag, setCountryFlag] = useState("🇺🇸");
  const [loading, setLoading] = useState(false);

  const parsed = parsePhoneNumberFromString(phoneNumber || "");

  const isPhoneValid = parsed ? parsed.isValid() : false;

  const hasChanges =
    firstName !== original.firstName ||
    lastName !== original.lastName ||
    phoneNumber !== original.phone ||
    gender !== original.gender ||
    dateOfBirth.getTime() !== original.dateOfBirth.getTime();

  const handleSave = async () => {
    if (phoneNumber && !isPhoneValid) {
      alert("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      await setDoc(
        doc(db, "users", userData.uid),
        {
          firstName,
          lastName,
          phone: phoneNumber.replace(/\s+/g, ""),
          dateOfBirth: Timestamp.fromDate(dateOfBirth),
          gender: gender || "",
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Something went wrong saving your info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#fff", paddingBottom: insets.bottom }}
    >
      <Stack.Screen
        options={{
          title: "Account info",
          headerTitleStyle: { fontFamily: "DMSans_600SemiBold" },
          headerTitleAlign: "center",
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          {/* First Name */}
          <TextRegular style={{ marginBottom: 6 }}>First name</TextRegular>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontFamily: "DMSans_400Regular",
              marginBottom: 16,
            }}
          />

          {/* Last Name */}
          <TextRegular style={{ marginBottom: 6 }}>Last name</TextRegular>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontFamily: "DMSans_400Regular",
              marginBottom: 16,
            }}
          />

          {/* Phone Number */}
          <TextRegular style={{ marginBottom: 6 }}>
            Phone (optional)
          </TextRegular>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              paddingHorizontal: 12,
              marginBottom: 16,
            }}
          >
            <Pressable
              onPress={() => setIsPickerVisible(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <TextRegular style={{ fontSize: 18 }}>{countryFlag}</TextRegular>
            </Pressable>

            <TextInput
              value={new AsYouType(countryCode as CountryCode).input(
                phoneNumber
              )}
              onChangeText={(text) => {
                setPhoneNumber(text);
              }}
              keyboardType="phone-pad"
              style={{
                flex: 1,
                paddingVertical: 12,
                fontFamily: "DMSans_400Regular",
              }}
              placeholder="Phone number"
            />
          </View>

          {/* Country Picker Modal */}
          <CountryPicker
            show={isPickerVisible}
            pickerButtonOnPress={(item) => {
              setCallingCode(item.dial_code.replace("+", ""));
              setCountryCode(item.code);
              setCountryFlag(item.flag);
              const national = phoneNumber.replace(/^\+\d+/, "");
              setPhoneNumber(`+${item.dial_code.replace("+", "")}${national}`);
              setIsPickerVisible(false);
            }}
            style={{
              modal: {
                height: 500,
              },
            }}
            enableModalAvoiding={true}
            onBackdropPress={() => setIsPickerVisible(false)}
            lang={"en"}
          />

          {/* Date of Birth */}
          <TextRegular style={{ marginBottom: 6 }}>Date of birth</TextRegular>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <TextRegular>
              {dateOfBirth.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </TextRegular>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDateOfBirth(selectedDate);
              }}
            />
          )}

          {/* Gender */}
          <TextRegular style={{ marginBottom: 6 }}>
            Gender (optional)
          </TextRegular>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View
          style={{
            padding: 20,
            borderTopWidth: 1,
            borderColor: "#eee",
            backgroundColor: "#fff",
          }}
        >
          <TouchableOpacity
            onPress={handleSave}
            disabled={!hasChanges || loading}
            style={{
              backgroundColor: !hasChanges || loading ? "#ccc" : "#000",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <TextSemiBold style={{ color: "#fff", fontSize: 16 }}>
              {loading ? "Saving..." : "Save"}
            </TextSemiBold>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AccountInfo;
