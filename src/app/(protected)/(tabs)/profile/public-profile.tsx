import { db } from "@/../firebaseConfig";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import UserAvatar from "@/components/UserAvatar";
import Briefcase from "@/components/icons/Briefcase";
import Language from "@/components/icons/Language";
import Colors from "@/constants/Colors";
import { useUser } from "@/contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Specialization {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

const SPECIALIZATIONS: Specialization[] = [
  { id: "general", name: "General Practice", color: "#E5E5E5" },
  { id: "pediatrics", name: "Pediatrics", color: "#FFE4B5" },
  { id: "cardiology", name: "Cardiology", color: "#FFB6C1" },
  { id: "dermatology", name: "Dermatology", color: "#F0FFF0" },
  { id: "oncology", name: "Oncology", color: "#E6E6FA" },
  { id: "neurology", name: "Neurology", color: "#ADD8E6" },
  { id: "ophthalmology", name: "Ophthalmology", color: "#FFB6C1" },
  { id: "orthopedics", name: "Orthopedics", color: "#FFE4C4" },
  { id: "psychiatry", name: "Psychiatry", color: "#98FB98" },
  { id: "neurosurgery", name: "Neurosurgery", color: "#90EE90" },
  { id: "allergy", name: "Allergy and Immunology", color: "#FFB6C1" },
  { id: "anesthesiology", name: "Anesthesiology", color: "#ADD8E6" },
  { id: "radiology", name: "Diagnostic Radiology", color: "#FFE4B5" },
  { id: "emergency", name: "Emergency Medicine", color: "#FFB6C1" },
  { id: "family", name: "Family Medicine", color: "#E6E6FA" },
  { id: "internal", name: "Internal Medicine", color: "#FFB6C1" },
  { id: "genetics", name: "Medical Genetics", color: "#98FB98" },
  { id: "nuclear", name: "Nuclear Medicine", color: "#ADD8E6" },
  { id: "obstetrics", name: "Obstetrics and gynecology", color: "#90EE90" },
  { id: "pathology", name: "Pathology", color: "#98FB98" },
  { id: "rehab", name: "Rehab", color: "#FFE4C4" },
  { id: "preventive", name: "Preventive Medicine", color: "#ADD8E6" },
  { id: "radiation", name: "Radiation Oncology", color: "#FFE4B5" },
  { id: "surgery", name: "Surgery", color: "#FFB6C1" },
  { id: "urology", name: "Urology", color: "#E6E6FA" },
  { id: "gastroenterology", name: "Gastroenterology", color: "#FFE4B5" },
];

const LANGUAGES = ["English", "Arabic", "Spanish", "French"];

// Helper function to compare arrays
const arraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
};

const PublicProfile = () => {
  const { data } = useUser();
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showSpecializationsModal, setShowSpecializationsModal] =
    useState(false);
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [experience, setExperience] = useState("");
  const [biography, setBiography] = useState("");
  const [consultationPrice, setConsultationPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Store initial values for change detection
  const [initialValues, setInitialValues] = useState({
    specializations: [] as string[],
    languages: [] as string[],
    experience: "",
    biography: "",
    consultationPrice: "",
  });

  // Check if any changes have been made
  const hasChanges = useMemo(() => {
    return (
      !isLoading && // Don't enable save while loading
      (!arraysEqual(selectedSpecializations, initialValues.specializations) ||
        !arraysEqual(selectedLanguages, initialValues.languages) ||
        experience !== initialValues.experience ||
        biography !== initialValues.biography ||
        consultationPrice !== initialValues.consultationPrice)
    );
  }, [
    isLoading,
    selectedSpecializations,
    selectedLanguages,
    experience,
    biography,
    consultationPrice,
    initialValues,
  ]);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const publicProfileRef = doc(db, "publicProfiles", data.uid);
        const docSnap = await getDoc(publicProfileRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data();
          const specializations = profileData.specializations || [];
          const languages = profileData.languages || [];
          const exp = profileData.experience?.toString() || "";
          const bio = profileData.biography || "";
          const price = profileData.consultationPrice?.toString() || "";

          // Set current values
          setSelectedSpecializations(specializations);
          setSelectedLanguages(languages);
          setExperience(exp);
          setBiography(bio);
          setConsultationPrice(price);

          // Set initial values for change detection
          setInitialValues({
            specializations,
            languages,
            experience: exp,
            biography: bio,
            consultationPrice: price,
          });
        }
      } catch (error) {
        console.error("Error fetching public profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data?.uid) {
      fetchPublicProfile();
    }
  }, [data?.uid]);

  const filteredSpecializations = useMemo(() => {
    return SPECIALIZATIONS.filter((spec) =>
      spec.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleSpecialization = (id: string) => {
    if (selectedSpecializations.includes(id)) {
      setSelectedSpecializations(
        selectedSpecializations.filter((s) => s !== id)
      );
    } else {
      setSelectedSpecializations([...selectedSpecializations, id]);
    }
  };

  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      setSaveStatus(null);

      // Update user document to set hasPublicProfile to true
      const userRef = doc(db, "users", data.uid);
      await updateDoc(userRef, {
        hasPublicProfile: true,
      });

      // Create or update public profile document
      const publicProfileRef = doc(db, "publicProfiles", data.uid);
      await setDoc(
        publicProfileRef,
        {
          uid: data.uid,
          specializations: selectedSpecializations,
          languages: selectedLanguages,
          experience: parseInt(experience, 10),
          biography,
          consultationPrice: parseInt(consultationPrice, 10),
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image || null,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );

      setSaveStatus({
        type: "success",
        message: "Profile updated successfully",
      });

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving public profile:", error);
      setSaveStatus({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderSpecializationItem = ({ item }: { item: Specialization }) => (
    <TouchableOpacity
      onPress={() => toggleSpecialization(item.id)}
      style={{
        flex: 1,
        margin: 6,
        padding: 16,
        borderRadius: 12,
        backgroundColor: selectedSpecializations.includes(item.id)
          ? item.color
          : "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 100,
      }}
    >
      {selectedSpecializations.includes(item.id) && (
        <View style={{ position: "absolute", top: 8, right: 8 }}>
          <Ionicons name="checkmark-circle" size={20} color="#000" />
        </View>
      )}
      <TextRegular
        style={{
          fontSize: 13,
          textAlign: "center",
          color: "#000",
        }}
      >
        {item.name}
      </TextRegular>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          title: "Edit Public Profile",
          headerTitleStyle: { fontFamily: "DMSans_600SemiBold" },
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: !hasChanges ? Colors.light.faintGrey : "#000",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 6,
                opacity: isSaving ? 0.5 : 1,
              }}
              onPress={handleSave}
              disabled={isSaving || !hasChanges}
            >
              <TextSemiBold style={{ color: "#fff", fontSize: 14 }}>
                {isSaving ? "Saving..." : "Save"}
              </TextSemiBold>
            </TouchableOpacity>
          ),
        }}
      />

      {saveStatus && (
        <View
          style={{
            padding: 16,
            backgroundColor:
              saveStatus.type === "success" ? Colors.green : Colors.pink,
            opacity: 0.8,
          }}
        >
          <TextRegular
            style={{ fontSize: 14, color: "#fff", textAlign: "center" }}
          >
            {saveStatus.message}
          </TextRegular>
        </View>
      )}

      {/* Specializations Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSpecializationsModal}
        onRequestClose={() => setShowSpecializationsModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <TextSemiBold style={{ fontSize: 24 }}>
                  Specializations
                </TextSemiBold>
                <TouchableOpacity
                  onPress={() => setShowSpecializationsModal(false)}
                >
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F5F5F5",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  marginBottom: 16,
                }}
              >
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search specializations"
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    fontFamily: "DMSans_400Regular",
                    fontSize: 16,
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                data={filteredSpecializations}
                renderItem={renderSpecializationItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Languages Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguagesModal}
        onRequestClose={() => setShowLanguagesModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
          onPress={() => setShowLanguagesModal(false)}
        >
          <Pressable
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              paddingBottom: 40,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <TextSemiBold style={{ fontSize: 18 }}>
                Select Languages
              </TextSemiBold>
              <TouchableOpacity onPress={() => setShowLanguagesModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            {LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F5F5F5",
                }}
                onPress={() => toggleLanguage(language)}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selectedLanguages.includes(language)
                      ? "#6366f1"
                      : "#E5E5E5",
                    marginRight: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedLanguages.includes(language) && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#6366f1",
                      }}
                    />
                  )}
                </View>
                <TextRegular style={{ fontSize: 16 }}>{language}</TextRegular>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 24,
        }}
      >
        {/* Doctor Info */}
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <UserAvatar size={48} />
          <View>
            <TextSemiBold style={{ fontSize: 20, color: "#000" }}>
              Dr. {data.firstName + " " + data.lastName}
            </TextSemiBold>
            <TextSemiBold
              style={{
                fontSize: 14,
                color: Colors.onlineConsultation,
              }}
            >
              doctor
            </TextSemiBold>
          </View>
        </View>

        {/* Specializations */}
        <View>
          <TextSemiBold style={{ fontSize: 16, marginBottom: 12 }}>
            Specializations
          </TextSemiBold>
          <TouchableOpacity
            onPress={() => setShowSpecializationsModal(true)}
            style={{
              borderWidth: 1,
              borderColor: "#E5E5E5",
              borderRadius: 8,
              padding: 12,
            }}
          >
            {selectedSpecializations.length ? (
              <View>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  {(() => {
                    const selected = SPECIALIZATIONS.filter((s) =>
                      selectedSpecializations.includes(s.id)
                    );
                    const displayItems = selected.slice(0, 2);
                    return (
                      <>
                        {displayItems.map((spec) => (
                          <View
                            key={spec.id}
                            style={{
                              backgroundColor: spec.color,
                              paddingVertical: 6,
                              paddingHorizontal: 12,
                              borderRadius: 16,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <TextRegular
                              style={{
                                fontSize: 14,
                                color: "#000",
                              }}
                            >
                              {spec.name}
                            </TextRegular>
                          </View>
                        ))}
                        {selected.length > 2 && (
                          <View
                            style={{
                              backgroundColor: "#F5F5F5",
                              paddingVertical: 6,
                              paddingHorizontal: 12,
                              borderRadius: 16,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <TextRegular
                              style={{
                                fontSize: 14,
                                color: "#666",
                              }}
                            >
                              +{selected.length - 2} more
                            </TextRegular>
                          </View>
                        )}
                      </>
                    );
                  })()}
                </View>
              </View>
            ) : (
              <TextRegular
                style={{
                  fontSize: 14,
                  color: "#666",
                }}
              >
                Select specializations
              </TextRegular>
            )}
            <View style={{ position: "absolute", right: 12, top: 12 }}>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Languages */}
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Language size={20} color="#000" />
            <TextSemiBold style={{ fontSize: 16 }}>Languages</TextSemiBold>
          </View>
          <TouchableOpacity
            onPress={() => setShowLanguagesModal(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "#E5E5E5",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <TextRegular
              style={{
                fontSize: 14,
                color: selectedLanguages.length ? "#000" : "#666",
              }}
            >
              {selectedLanguages.length
                ? selectedLanguages.join(", ")
                : "Select languages"}
            </TextRegular>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Experience */}
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Briefcase size={20} color="#000" />
            <TextSemiBold style={{ fontSize: 16 }}>Experience</TextSemiBold>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TextInput
              value={experience}
              onChangeText={setExperience}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#E5E5E5",
                borderRadius: 8,
                padding: 12,
                width: 80,
                fontFamily: "DMSans_400Regular",
                fontSize: 14,
              }}
            />
            <TextRegular style={{ fontSize: 14, color: "#666" }}>
              years of experience
            </TextRegular>
          </View>
        </View>

        {/* Biography */}
        <View>
          <TextSemiBold style={{ fontSize: 16, marginBottom: 12 }}>
            Biography
          </TextSemiBold>
          <TextInput
            value={biography}
            onChangeText={setBiography}
            multiline
            numberOfLines={6}
            style={{
              borderWidth: 1,
              borderColor: "#E5E5E5",
              borderRadius: 8,
              padding: 12,
              fontFamily: "DMSans_400Regular",
              fontSize: 14,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* Consultation Price */}
        <View>
          <TextSemiBold style={{ fontSize: 16, marginBottom: 12 }}>
            Consultation Price
          </TextSemiBold>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextRegular style={{ fontSize: 16, marginRight: 8 }}>
              $
            </TextRegular>
            <TextInput
              value={consultationPrice}
              onChangeText={setConsultationPrice}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#E5E5E5",
                borderRadius: 8,
                padding: 12,
                width: 100,
                fontFamily: "DMSans_400Regular",
                fontSize: 14,
              }}
            />
            <TextRegular
              style={{
                fontSize: 14,
                color: "#666",
                marginLeft: 8,
              }}
            >
              per consultation
            </TextRegular>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PublicProfile;
