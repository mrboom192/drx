import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import { useSignUp } from "@/contexts/SignupContext";
import { router } from "expo-router";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useSession } from "@/contexts/AuthContext";

const SignIn = () => {
  const { signUpData, setSignUpData } = useSignUp();
  const { signIn } = useSession();
  const [emailError, setEmailError] = useState("");
  const [checking, setChecking] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleContinue = async () => {
    if (!validateEmail(signUpData.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setChecking(true);

    try {
      const methods = await fetchSignInMethodsForEmail(auth, signUpData.email);

      if (methods.length > 0) {
        setShowPasswordInput(true);
      } else {
        router.push("/signup");
      }
    } catch (error) {
      console.error("Firebase check error:", error);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleRecover = () => {
    console.log("Recover account");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          justifyContent: "flex-start",
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "dm-sb",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          Log in or sign up into DrX
        </Text>

        <View
          style={{
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Text style={{ fontFamily: "dm", fontSize: 16 }}>Email</Text>
          <TextInput
            editable={!checking}
            style={{
              borderColor: Colors.light.faintGrey,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              fontFamily: "dm",
            }}
            placeholder="myemail@email.com"
            placeholderTextColor={Colors.light.grey}
            value={signUpData.email}
            onChangeText={(text) => {
              setSignUpData({ email: text });
              if (emailError) setEmailError("");
              setShowPasswordInput(false); // reset on email change
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text
              style={{
                color: Colors.pink,
                fontSize: 14,
                fontFamily: "dm",
                marginTop: 4,
              }}
            >
              {emailError}
            </Text>
          ) : null}
        </View>

        {showPasswordInput && (
          <View style={{ marginTop: 24, opacity: checking ? 0.5 : 1 }}>
            <Text style={{ fontFamily: "dm", fontSize: 16, marginBottom: 8 }}>
              Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderColor: Colors.light.faintGrey,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 4,
              }}
            >
              <TextInput
                editable={!checking}
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontFamily: "dm",
                  paddingVertical: 10,
                }}
                placeholder="Password"
                placeholderTextColor={Colors.light.grey}
                secureTextEntry={!showPassword}
                value={signUpData.password}
                onChangeText={(text) => setSignUpData({ password: text })}
              />
              <TouchableOpacity
                disabled={checking}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={checking}
              style={{
                marginTop: 16,
                backgroundColor: "#000",
                borderRadius: 8,
                paddingVertical: 16,
                alignItems: "center",
              }}
              onPress={() => signIn(signUpData.email, signUpData.password)}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "dm-sb",
                }}
              >
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!showPasswordInput && (
          <TouchableOpacity
            disabled={checking}
            style={{
              backgroundColor: "#000",
              borderRadius: 8,
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={handleContinue}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontFamily: "dm-sb",
              }}
            >
              {checking ? "Loading..." : "Continue"}
            </Text>
          </TouchableOpacity>
        )}

        {/* OR Separator */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: Colors.light.faintGrey,
            }}
          />
          <Text
            style={{
              marginHorizontal: 12,
              fontSize: 16,
              color: "#444",
              fontFamily: "dm-sb",
            }}
          >
            or
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: Colors.light.faintGrey,
            }}
          />
        </View>

        {/* Recover link */}
        <TouchableOpacity
          disabled={checking}
          onPress={handleRecover}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ionicons name="search-outline" size={16} color="#000" />
          <Text
            style={{
              fontSize: 16,
              color: "#000",
              fontFamily: "dm-sb",
            }}
          >
            Recover my account
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Text
        style={{
          fontSize: 12,
          color: "#666",
          textAlign: "center",
          lineHeight: 16,
          fontFamily: "dm",
        }}
      >
        By proceeding, you consent to get calls, WhatsApp or SMS/RCS messages,
        including by automated dialer, from DrX and its affiliates to the number
        provided. Text "STOP" to 89203 to opt out.
      </Text>
    </SafeAreaView>
  );
};

export default SignIn;
