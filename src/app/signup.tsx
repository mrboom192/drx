import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useSession } from "@/contexts/AuthContext";
import { useSignUp } from "@/contexts/SignupContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignUp = () => {
  const { signUpData, setSignUpData } = useSignUp();
  const { signUp } = useSession();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSignUpData({ dateOfBirth: selectedDate });
    }
  };

  const handleSignUp = async () => {
    const { email, password, ...userInfo } = signUpData;

    try {
      setSubmitting(true);
      await signUp(email, password, userInfo);
    } catch (e) {
      // Already handled in the context, but you could add UI feedback here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          disabled={submitting}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={submitting ? "#aaa" : "#000"}
          />
        </TouchableOpacity>

        <TextSemiBold
          style={{
            fontSize: 20,
            marginVertical: 24,
            textAlign: "center",
          }}
        >
          Finish signing up
        </TextSemiBold>

        {/* Role Selector */}
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: Colors.light.faintGrey,
            borderRadius: 100,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {["Patient", "Doctor"].map((option) => (
            <TouchableOpacity
              key={option}
              disabled={submitting}
              onPress={() => {
                setSignUpData({
                  role: option.toLowerCase() as "patient" | "doctor",
                });
              }}
              style={{
                flex: 1,
                backgroundColor:
                  signUpData.role === option.toLowerCase()
                    ? "#8854D0"
                    : "transparent",
                paddingVertical: 12,
                borderRadius: 100,
                alignItems: "center",
              }}
            >
              <TextSemiBold
                style={{
                  color:
                    signUpData.role === option.toLowerCase() ? "#fff" : "#000",
                }}
              >
                {option}
              </TextSemiBold>
            </TouchableOpacity>
          ))}
        </View>

        {/* First Name */}
        <TextRegular style={{ fontSize: 14, marginBottom: 6 }}>
          First name
        </TextRegular>
        <TextInput
          editable={!submitting}
          style={{
            borderColor: Colors.light.faintGrey,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            fontFamily: "DMSans_400Regular",
            marginBottom: 16,
          }}
          placeholder="e.g. John"
          value={signUpData.firstName}
          onChangeText={(text) => setSignUpData({ firstName: text })}
        />

        {/* Last Name */}
        <TextRegular style={{ fontSize: 14, marginBottom: 6 }}>
          Last name
        </TextRegular>
        <TextInput
          editable={!submitting}
          style={{
            borderColor: Colors.light.faintGrey,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            fontFamily: "DMSans_400Regular",
            marginBottom: 16,
          }}
          placeholder="e.g. Smith"
          value={signUpData.lastName}
          onChangeText={(text) => setSignUpData({ lastName: text })}
        />

        {/* Date of Birth */}
        <TextRegular style={{ fontSize: 14, marginBottom: 6 }}>
          Date of birth
        </TextRegular>
        <Pressable
          onPress={() => !submitting && setShowDatePicker(true)}
          style={{
            borderColor: Colors.light.faintGrey,
            borderWidth: 1,
            borderRadius: 8,
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginBottom: 16,
            justifyContent: "space-between",
          }}
        >
          <TextRegular
            style={{
              color: signUpData.dateOfBirth ? "#000" : Colors.light.grey,
            }}
          >
            {signUpData.dateOfBirth
              ? format(signUpData.dateOfBirth, "MMMM d, yyyy")
              : "Birthdate"}
          </TextRegular>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={Colors.light.grey}
          />
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={signUpData.dateOfBirth || new Date(2000, 0, 1)}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Password */}
        <TextRegular style={{ fontSize: 14, marginBottom: 6 }}>
          Password
        </TextRegular>
        <View
          style={{
            borderColor: Colors.light.faintGrey,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 4,
            marginBottom: 16,
          }}
        >
          <TextInput
            editable={!submitting}
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: "DMSans_400Regular",
              paddingVertical: 10,
            }}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={signUpData.password}
            onChangeText={(text) => setSignUpData({ password: text })}
          />
          <TouchableOpacity
            disabled={submitting}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.light.grey}
            />
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <TextRegular
          style={{
            fontSize: 12,
            color: "#666",
            textAlign: "center",
            lineHeight: 16,
            marginBottom: 24,
          }}
        >
          By selecting Agree and continue, I agree to DrX's{" "}
          <TextRegular style={{ textDecorationLine: "underline" }}>
            Terms of Service, Payments Terms of Service and Nondiscrimination
            Policy
          </TextRegular>{" "}
          and acknowledge the{" "}
          <TextRegular style={{ textDecorationLine: "underline" }}>
            Privacy Policy
          </TextRegular>
          .
        </TextRegular>

        {/* Agree Button */}
        <TouchableOpacity
          disabled={submitting}
          style={{
            backgroundColor: "#000",
            borderRadius: 8,
            paddingVertical: 16,
            alignItems: "center",
          }}
          onPress={handleSignUp}
        >
          <TextSemiBold
            style={{
              color: "#fff",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {submitting ? "Signing up..." : "Agree and continue"}
          </TextSemiBold>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
