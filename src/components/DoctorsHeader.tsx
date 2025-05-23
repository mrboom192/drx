import Colors from "@/constants/Colors";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextSemiBold } from "./StyledText";
import { ScrollView, TouchableOpacity, View } from "./Themed";

const categories = [
  {
    name: "All",
    icon: "user",
  },
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
  const scrollRef = useRef<typeof ScrollView | null>(null);
  const router = useRouter();
  const itemsRef = useRef<Array<typeof TouchableOpacity | null>>([]);
  const { colorScheme, themeBorderStyle, themeTextStyleSecondary } =
    useThemedStyles();
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    (selected as any)?.measure((x: number) => {
      (scrollRef.current as any)?.scrollTo({
        x: x - 16,
        y: 0,
        animated: true,
      });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSpecialtyChange(categories[index].name);
  };

  return (
    <View style={{ paddingTop: insets.top }}>
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
                colorScheme === "light" ? Colors.light.grey : Colors.light.grey
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/search-modal" })}
            style={[themeBorderStyle, styles.searchBtn]}
          >
            <Ionicons
              name="search"
              size={24}
              color={
                colorScheme === "light" ? Colors.light.grey : Colors.light.grey
              }
            />
            <View>
              <TextSemiBold style={themeTextStyleSecondary}>
                Find the perfect doctor
              </TextSemiBold>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(protected)/(modals)/filter")}
            style={[themeBorderStyle, styles.filterBtn]}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={
                colorScheme === "light" ? Colors.light.grey : Colors.light.grey
              }
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef as any}
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
              ref={(el: any) => (itemsRef.current[index] = el)}
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <TextSemiBold
                style={
                  activeIndex === index
                    ? { color: Colors.primary }
                    : themeTextStyleSecondary
                }
              >
                {item.name}
              </TextSemiBold>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
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
