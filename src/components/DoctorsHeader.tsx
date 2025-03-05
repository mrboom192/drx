import { StyleSheet, useColorScheme } from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "./Themed";
import { Link, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { themedStyles } from "@/constants/Styles";
import Rating from "./Rating";

const categories = [
  {
    name: "General Practice",
    icon: "stethoscope",
  },
  {
    name: "Pediatrics",
    icon: "child_care",
  },
  {
    name: "Cardiology",
    icon: "favorite",
  },
  {
    name: "Dermatology",
    icon: "healing",
  },
  {
    name: "Oncology",
    icon: "coronavirus",
  },
  {
    name: "Neurology",
    icon: "psychology",
  },
  {
    name: "Ophthalmology",
    icon: "visibility",
  },
  {
    name: "Orthopedics",
    icon: "accessibility_new",
  },
  {
    name: "Psychiatry",
    icon: "psychology_alt",
  },
  {
    name: "Neurosurgery",
    icon: "medical_services",
  },
  {
    name: "Allergy and Immunology",
    icon: "sick",
  },
  {
    name: "Anesthesiology",
    icon: "mask",
  },
  {
    name: "Diagnostic Radiology",
    icon: "biotech",
  },
  {
    name: "Emergency Medicine",
    icon: "local_hospital",
  },
  {
    name: "Family Medicine",
    icon: "group",
  },
  {
    name: "Internal Medicine",
    icon: "medication",
  },
  {
    name: "Medical Genetics",
    icon: "science",
  },
  {
    name: "Nuclear Medicine",
    icon: "radiology",
  },
  {
    name: "Obstetrics and Gynecology",
    icon: "pregnant_woman",
  },
  {
    name: "Pathology",
    icon: "microscope",
  },
  {
    name: "Rehab",
    icon: "elderly",
  },
  {
    name: "Preventive Medicine",
    icon: "health_and_safety",
  },
  {
    name: "Radiation Oncology",
    icon: "radiology",
  },
  {
    name: "Surgery",
    icon: "surgical",
  },
  {
    name: "Urology",
    icon: "water_drop",
  },
  {
    name: "Gastroenterology",
    icon: "stomach",
  },
];

interface Props {
  onSpecialtyChange: (specialty: string) => void;
}

const DoctorsHeader = ({ onSpecialtyChange }: Props) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const router = useRouter();
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const colorScheme = useColorScheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const themeTextStylePrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : themedStyles.darkTextPrimary;

  const themeTextStyleSecondary =
    colorScheme === "light"
      ? themedStyles.lightTextSecondary
      : themedStyles.darkTextSecondary;

  const themeBorderStyle =
    colorScheme === "light"
      ? themedStyles.lightBorder
      : themedStyles.darkBorder;

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    selected?.measure((x: number) => {
      scrollRef.current?.scrollTo({
        x: x - 16,
        y: 0,
        animated: true,
      });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSpecialtyChange(categories[index].name);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          {/* Search container */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={[themeBorderStyle, styles.filterBtn]}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={
                colorScheme === "light" ? Colors.light.grey : Colors.dark.grey
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/")}
            style={[themeBorderStyle, styles.searchBtn]}
          >
            <Ionicons
              name="search"
              size={24}
              s
              color={
                colorScheme === "light" ? Colors.light.grey : Colors.dark.grey
              }
            />
            <View>
              <Text style={[themeTextStyleSecondary, { fontFamily: "dm-sb" }]}>
                Find the perfect doctor
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(modals)/filter")}
            style={[themeBorderStyle, styles.filterBtn]}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={
                colorScheme === "light" ? Colors.light.grey : Colors.dark.grey
              }
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            themeBorderStyle,
            {
              borderWidth: 0,
              borderBottomWidth: 1,
              alignItems: "center",
              gap: 30,
              paddingHorizontal: 16,
              paddingBottom: 16,
            },
          ]}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              onPress={() => selectCategory(index)}
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MaterialIcons
                name={item.icon as any}
                color={
                  activeIndex === index
                    ? Colors.primary
                    : colorScheme === "light"
                    ? Colors.light.grey
                    : Colors.dark.grey
                }
                size={24}
              />
              <Text
                style={
                  activeIndex === index
                    ? { color: Colors.primary, fontFamily: "dm-sb" }
                    : [themeTextStyleSecondary, { fontFamily: "dm-sb" }]
                }
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 16,
  },
  filterBtn: {
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    gap: 10,
    flex: 1,
    padding: 14,
    borderRadius: 30,
  },
});

export default DoctorsHeader;
