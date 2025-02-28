import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import LabeledInput from "../components/LabeledInput";
import { useSession } from "@/src/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const Page = () => {
  const { signUp } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSignUp() {
    try {
      await signUp(email, password);
    } catch (error) {
      console.error("Sign-up failed");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
          <View style={styles.inputContainer}>
            <Text style={styles.subtitle}>Create an account</Text>
            <LabeledInput
              label="Email"
              placeholder="Email"
              iconLeft={
                <Ionicons name="mail-outline" size={16} color="#717171" />
              }
              value={email}
              onChangeText={setEmail}
            />
            <LabeledInput
              label="Password"
              placeholder="Password"
              iconLeft={
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color="#717171"
                />
              }
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            {loading ? (
              <ActivityIndicator size="small" style={styles.loadingIndicator} />
            ) : (
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
              >
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.alreadyAccountContainer}>
            <Text style={styles.alreadyAccountText}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.back()}
            >
              <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "white",
    textTransform: "capitalize",
    fontWeight: "500",
  },
  button: {
    width: 128,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#2C2C2C",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: "flex-start",
    marginHorizontal: 32,
    marginTop: 16,
    marginBottom: 64,
  },
  keyboardView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    gap: 8,
  },
  title: {
    color: "#F1744D",
    fontSize: 32,
    fontWeight: "500",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
  },
  subtitle: {
    color: "#475569",
    fontSize: 20,
    fontWeight: "400",
  },
  loadingIndicator: {
    margin: 28,
  },
  signUpButton: {
    alignSelf: "stretch",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#2C2C2C",
  },
  signUpText: {
    color: "white",
    textTransform: "uppercase",
  },
  separatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    alignSelf: "stretch",
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#AAA",
  },
  alreadyAccountContainer: {
    alignSelf: "stretch",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
  },
  alreadyAccountText: {
    color: "#475569",
  },
  signInLink: {
    color: "#F1744D",
    textDecorationLine: "underline",
  },
});

export default Page;
