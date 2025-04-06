import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
// import { auth } from "../../firebaseConfig";
import auth from "@react-native-firebase/auth";
import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";

export default function App() {
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [callingCode, setCallingCode] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState("");

  const auth = getAuth(getApp());
  signInWithPhoneNumber(auth, "+16505553434");

  // This line disables app verification during testing
  auth.settings.appVerificationDisabledForTesting = true;

  const handleSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  const fullPhoneNumber = `+${callingCode}${phoneNumber}`;

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in:", user.phoneNumber);
        // Navigate to home or hide OTP input
      }
    });
    return subscriber;
  }, []);

  const handleContinue = async () => {
    const cleanedNumber = `+${callingCode}${phoneNumber.replace(
      /[^0-9]/g,
      ""
    )}`;

    if (!cleanedNumber || cleanedNumber.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    console.log(cleanedNumber);

    try {
      const confirmation = await auth.signInWithPhoneNumber(cleanedNumber);
      setConfirm(confirmation);
    } catch (error) {
      console.error("SMS not sent:", error);
      alert("Something went wrong. Please double-check your number.");
    }
  };

  const confirmCode = async () => {
    try {
      await confirm.confirm(code);
      console.log("Code confirmed!");
    } catch (error) {
      console.log("Invalid code:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, margin: 16, justifyContent: "center" }}
      >
        <Text
          style={{
            fontSize: 24,
            marginBottom: 16,
            textAlign: "center",
            fontFamily: "dm-sb",
          }}
        >
          Log in or sign up for DrX
        </Text>

        {!confirm ? (
          <>
            <Text style={{ marginBottom: 8, fontFamily: "dm" }}>
              Mobile Number
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 24,
              }}
            >
              <CountryPicker
                countryCode={countryCode}
                withFlag
                withCallingCode
                withFilter
                withEmoji
                onSelect={handleSelect}
                containerButtonStyle={{ marginRight: 6 }}
              />
              <Text style={{ fontSize: 16, marginRight: 6, fontFamily: "dm" }}>
                +{callingCode}
              </Text>
              <TextInput
                style={{ flex: 1, fontSize: 16, fontFamily: "dm" }}
                keyboardType="phone-pad"
                placeholder="(201) 555-0123"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              style={{
                backgroundColor: "#000",
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 48,
              }}
            >
              <Text
                style={{ color: "#fff", fontSize: 16, fontFamily: "dm-sb" }}
              >
                Continue
              </Text>
            </TouchableOpacity>

            <Text style={{ color: Colors.light.grey, fontFamily: "dm" }}>
              By proceeding, you consent to get calls, WhatsApp or SMS/RCS
              messages, including by automated dialer, from DrX and its
              affiliates to the number provided. Text "STOP" to 89203 to opt
              out.
            </Text>
          </>
        ) : (
          <>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "dm-sb",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Enter the verification code sent to{" "}
              <Text style={{ fontFamily: "dm" }}>{fullPhoneNumber}</Text>
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                fontFamily: "dm",
                marginBottom: 24,
              }}
              keyboardType="number-pad"
              placeholder="123456"
              value={code}
              onChangeText={setCode}
            />

            <TouchableOpacity
              onPress={confirmCode}
              style={{
                backgroundColor: "#000",
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{ color: "#fff", fontSize: 16, fontFamily: "dm-sb" }}
              >
                Confirm Code
              </Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
