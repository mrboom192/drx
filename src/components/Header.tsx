import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { ScrollView } from "react-native";
import * as Haptics from "expo-haptics";

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
  onCategoryChange: (category: string) => void;
}

const DoctorsHeader = ({ onCategoryChange }: Props) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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
    onCategoryChange(categories[index].name);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={"/"} asChild>
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search" size={24} />
              <View>
                <Text style={{ fontFamily: "dm-sb" }}>
                  Find the perfect doctor
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: 30,
            paddingHorizontal: 16, // 1:29:00
          }}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              onPress={() => selectCategory(index)}
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              style={
                activeIndex === index
                  ? styles.categoriesBtnActive
                  : styles.categoriesBtn
              }
            >
              <MaterialIcons
                name={item.icon as any}
                color={activeIndex === index ? "#000" : Colors.grey}
                size={24}
              />
              <Text
                style={
                  activeIndex === index
                    ? styles.categoryTextActive
                    : styles.categoryText
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
    backgroundColor: "#fff",
    height: 140,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 10,
  },
  filterBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 24,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderColor: "#c2c2c2",
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    padding: 14,
    borderRadius: 30,
    backgroundColor: "#fff",

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "dm-sb",
    color: Colors.grey,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: "dm-sb",
    color: "#000",
  },
  categoriesBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
});

export default DoctorsHeader;
