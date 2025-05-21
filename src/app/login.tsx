import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useSession } from "@/contexts/AuthContext";
import { useSignUp } from "@/contexts/SignupContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebaseConfig";

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
        <TextSemiBold
          style={{
            fontSize: 20,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          Log in or sign up into DrX
        </TextSemiBold>

        <View
          style={{
            flexDirection: "column",
            gap: 8,
          }}
        >
          <TextRegular style={{ fontSize: 16 }}>Email</TextRegular>
          <TextInput
            editable={!checking}
            style={{
              borderColor: Colors.light.faintGrey,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              fontFamily: "DMSans_400Regular",
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
            <TextRegular
              style={{
                color: Colors.pink,
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {emailError}
            </TextRegular>
          ) : null}
        </View>

        {showPasswordInput && (
          <View style={{ marginTop: 24, opacity: checking ? 0.5 : 1 }}>
            <TextRegular style={{ fontSize: 16, marginBottom: 8 }}>
              Password
            </TextRegular>
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
                  fontFamily: "DMSans_400Regular",
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
              <TextSemiBold
                style={{
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                Log in
              </TextSemiBold>
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
            <TextSemiBold
              style={{
                color: "#fff",
                fontSize: 16,
              }}
            >
              {checking ? "Loading..." : "Continue"}
            </TextSemiBold>
          </TouchableOpacity>
        )}

        {/* <View
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
          <TextSemiBold
            style={{
              marginHorizontal: 12,
              fontSize: 16,
              color: "#444",
            }}
          >
            or
          </TextSemiBold>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: Colors.light.faintGrey,
            }}
          />
        </View>
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
          <TextSemiBold
            style={{
              fontSize: 16,
              color: "#000",
            }}
          >
            Recover my account
          </TextSemiBold>
        </TouchableOpacity> */}
      </KeyboardAvoidingView>

      <TextRegular
        style={{
          fontSize: 14,
          color: "#666",
          textAlign: "center",
          marginHorizontal: 16,
        }}
      >
        By using our app, you agree to our{" "}
        <Link href="/terms-of-service" asChild>
          <TextSemiBold style={{ color: Colors.primary }}>
            Terms of Service
          </TextSemiBold>
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy">
          {" "}
          <TextSemiBold style={{ color: Colors.primary }}>
            Privacy Policy
          </TextSemiBold>
        </Link>
        .
      </TextRegular>
    </SafeAreaView>
  );
};

export default SignIn;
