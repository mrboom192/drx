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
import { useSession } from "@/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Sign-in failed");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
          <Text style={styles.title}>DrX</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.subtitle}>Have an account?</Text>
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
              labelRight={
                <Link href="/">
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </Link>
              }
            />
          </View>
          {loading ? (
            <ActivityIndicator size="small" style={styles.loadingIndicator} />
          ) : (
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Text style={styles.text}>Sign in</Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text>Or</Text>
          <View style={styles.separator} />
        </View>
        <View style={styles.newAccountContainer}>
          <Text style={styles.newAccountText}>
            New here? Create an account in minutes!
          </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity style={styles.createAccountButton}>
              <Text style={styles.text}>Create account</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginHorizontal: 32,
    marginTop: 16,
    marginBottom: 64,
  },
  keyboardView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    color: "#660066",
    fontSize: 32,
    fontWeight: "500",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  subtitle: {
    color: "#475569",
    fontSize: 20,
    fontWeight: "400",
  },
  forgotPassword: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  loadingIndicator: {
    margin: 28,
  },
  signInButton: {
    alignSelf: "stretch",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#2C2C2C",
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
  newAccountContainer: {
    alignSelf: "stretch",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
  },
  newAccountText: {
    color: "#475569",
  },
  createAccountButton: {
    alignSelf: "stretch",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#2C2C2C",
  },
});

export default SignIn;
