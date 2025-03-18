import {
  View,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import LabeledInput from "../components/LabeledInput";
import { useSession } from "@/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth } from "../../firebaseConfig";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: string;
  weight?: {
    value: string;
    unit: "kg" | "lbs";
  };
  height?: {
    value: string;
    unit: "cm" | "ft";
  };
}

const Page = () => {
  const { signUp } = useSession();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"doctor" | "patient">("patient");
  const [language, setLanguage] = useState<string>("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      age: "",
      weight: { value: "", unit: "kg" },
      height: { value: "", unit: "cm" },
    },
  });

  async function handleSignUp(data: SignUpFormData) {
    setLoading(true);
    try {
      const userData: any = {
        firstName: `${data.firstName}`,
        lastName: `${data.lastName}`,
        role: userType,
        gender,
        age: Number(data.age),
        language,
      };

      // Add weight and height only for patients
      if (userType === "patient") {
        userData.weight = {
          value: Number(data.weight?.value),
          unit: weightUnit,
        };
        userData.height = {
          value: Number(data.height?.value),
          unit: heightUnit,
        };
      }

      await signUp(data.email, data.password, userData);

      if (auth.currentUser) {
        router.replace("../");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Sign-up failed", error);
        alert("Registration failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              userType === "doctor" && styles.activeButton,
            ]}
            onPress={() => setUserType("doctor")}
          >
            <Text style={styles.toggleText}>Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              userType === "patient" && styles.activeButton,
            ]}
            onPress={() => setUserType("patient")}
          >
            <Text style={styles.toggleText}>Patient</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
          <View style={styles.inputContainer}>
            <Text style={styles.subtitle}>Create an account ({userType})</Text>

            {/* First Name */}
            <Controller
              control={control}
              name="firstName"
              rules={{ required: "First name is required" }}
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="First Name"
                  placeholder="First Name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName.message}</Text>
            )}

            {/* Last Name */}
            <Controller
              control={control}
              name="lastName"
              rules={{ required: "Last name is required" }}
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="Last Name"
                  placeholder="Last Name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName.message}</Text>
            )}

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="Email"
                  placeholder="Email"
                  iconLeft={
                    <Ionicons name="mail-outline" size={16} color="#717171" />
                  }
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field: { onChange, value } }) => (
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
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  autoCapitalize="none"
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            {/* Other Inputs */}
            {/* Email, Password, Age, Gender (same as before) */}

            {/* Weight (only for patients) */}
            {userType === "patient" && (
              <>
                <Controller
                  control={control}
                  name="weight.value"
                  rules={{ required: "Weight is required" }}
                  render={({ field: { onChange, value } }) => (
                    <LabeledInput
                      label="Weight"
                      placeholder="Enter weight"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.weight && (
                  <Text style={styles.errorText}>
                    {errors.weight.value?.message}
                  </Text>
                )}

                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      weightUnit === "kg" && styles.activeButton,
                    ]}
                    onPress={() => setWeightUnit("kg")}
                  >
                    <Text style={styles.toggleText}>kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      weightUnit === "lbs" && styles.activeButton,
                    ]}
                    onPress={() => setWeightUnit("lbs")}
                  >
                    <Text style={styles.toggleText}>lbs</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Height (only for patients) */}
            {userType === "patient" && (
              <>
                <Controller
                  control={control}
                  name="height.value"
                  rules={{ required: "Height is required" }}
                  render={({ field: { onChange, value } }) => (
                    <LabeledInput
                      label="Height"
                      placeholder="Enter height"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.height && (
                  <Text style={styles.errorText}>
                    {errors.height.value?.message}
                  </Text>
                )}

                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      heightUnit === "cm" && styles.activeButton,
                    ]}
                    onPress={() => setHeightUnit("cm")}
                  >
                    <Text style={styles.toggleText}>cm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      heightUnit === "ft" && styles.activeButton,
                    ]}
                    onPress={() => setHeightUnit("ft")}
                  >
                    <Text style={styles.toggleText}>ft</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Submit Button */}
            {loading ? (
              <ActivityIndicator size="small" style={styles.loadingIndicator} />
            ) : (
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSubmit(handleSignUp)}
              >
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  toggleButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  activeButton: {
    backgroundColor: "#2C2C2C",
  },
  toggleText: {
    color: "white",
  },
  keyboardView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    gap: 8,
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
  errorText: {
    color: "red",
    fontSize: 12,
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
  alreadyAccountContainer: {
    alignSelf: "stretch",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
  },
  alreadyAccountText: {
    color: "#475569",
  },
  languageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  languageButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  languageText: {
    color: "white",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  genderButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  genderText: {
    color: "white",
  },
  blackText: {
    color: "black",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Page;
