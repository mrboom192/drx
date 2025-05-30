import InfoBottomSheet from "@/components/InfoBottomSheet";
import Colors from "@/constants/Colors";
import { useThemedStyles } from "@/hooks/useThemeStyles";
import {
  useCases,
  useIsFetchingCases,
  useStartCasesListener,
} from "@/stores/useCaseStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import CustomIcon from "../icons/CustomIcon";
import Filter from "../icons/Filter";
import LoadingScreen from "../LoadingScreen";
import { TextRegular, TextSemiBold } from "../StyledText";

const mockCases = [
  {
    id: "7NP2gjEPQtGAKMLk",
    title: "Persistent Knee Pain After Injury",
    description:
      "I've been experiencing persistent knee pain for the past 3 months after a minor fall while jogging. The pain worsens with movement, and there is occasional swelling. My primary doctor suggested it might be a minor ligament strain, but I want a second opinion to confirm if further imaging or treatment is needed.",
    images: [
      "https://i.redd.it/lwiw8ukr8q7c1.jpeg",
      "https://preview.redd.it/22iubb45p2c31.jpg?width=1080&crop=smart&auto=webp&s=6167c597d3a12a69123cbc13c13d335e68b95b30",
    ],
    reviewed: false,
  },
  {
    id: "M5hEmAwxOfMDariM",
    title: "Recurring Insomnia",
    description:
      "I've been experiencing recurring insomnia even after several doctors visits",
    images: [
      "https://i.redd.it/sleep-cycle-user-with-3-628-logged-nights-v0-4uysp3sp108a1.jpg?width=1170&format=pjpg&auto=webp&s=51ebab3eac1c787651c4ee3246487a51eabe6058",
    ],
    reviewed: true,
  },
];

const SecondOpinion = () => {
  const startCasesListener = useStartCasesListener();
  const cases = useCases();
  const isFetchingCases = useIsFetchingCases();
  const { themeBorderStyle, themeTextStylePrimary, themeTextStyleSecondary } =
    useThemedStyles();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present(); // Collapses bottom sheet, showing map
  }, []);

  useEffect(() => {
    startCasesListener(); // Doesnt run if there is already a listener
  }, []);

  if (isFetchingCases) return <LoadingScreen />;

  return (
    <View style={{ flex: 1 }}>
      {/* Widgets */}
      <View
        style={{
          width: "100%",
          padding: 16,
          flexDirection: "column",
          gap: 16,
        }}
      >
        <TextSemiBold style={[themeTextStylePrimary, { fontSize: 20 }]}>
          Second Opinion
        </TextSemiBold>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flexDirection: "column", gap: 8, flex: 1 }}>
            <TouchableOpacity
              onPress={handlePresentModalPress}
              style={[
                { backgroundColor: Colors.secondOpinionBackground },
                {
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <TextSemiBold style={[themeTextStylePrimary, { fontSize: 16 }]}>
                About
              </TextSemiBold>
              <CustomIcon size={24} name="arrow-outward" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                themeBorderStyle,
                {
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                },
              ]}
            >
              <Filter size={24} color={"#000"} />
              <TextSemiBold style={[themeTextStylePrimary, { fontSize: 16 }]}>
                Provider preferences
              </TextSemiBold>
            </TouchableOpacity>
          </View>
          <View
            style={[
              { backgroundColor: Colors.secondOpinionBackground },
              {
                flex: 1,
                borderRadius: 16,
                padding: 16,
                flexDirection: "column",
                justifyContent: "space-between",
              },
            ]}
          >
            <TextSemiBold style={{ fontSize: 16 }}>
              Number of Opinions
            </TextSemiBold>
            <TextSemiBold style={{ fontSize: 28 }}>{cases.length}</TextSemiBold>
          </View>
        </View>
      </View>

      {/* Start a new case */}
      <View
        style={[
          themeBorderStyle,
          {
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            marginHorizontal: 16,
            marginBottom: 16,
            borderRadius: 16,
            overflow: "hidden",
          },
        ]}
      >
        {/* Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "column", gap: 8 }}>
            <TextSemiBold style={[themeTextStylePrimary, { fontSize: 20 }]}>
              Cases
            </TextSemiBold>
            <TextRegular style={[themeTextStyleSecondary, { fontSize: 16 }]}>
              {`${cases.filter((c) => c.status === "reviewed").length}/${
                cases.length
              } Cases reviewed`}
            </TextRegular>
          </View>
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 32,
              borderWidth: 1,
              borderColor: Colors.light.grey,
              justifyContent: "center",
            }}
          >
            <TextSemiBold
              style={{
                color: Colors.light.grey,
                textAlign: "center",
                fontSize: 12,
              }}
            >
              View All
            </TextSemiBold>
          </TouchableOpacity>
        </View>

        {/* Second Opinion Requests */}
        <View
          style={[
            themeBorderStyle,
            { borderLeftWidth: 0, borderRightWidth: 0, paddingVertical: 16 },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              {
                alignItems: "center",
                gap: 16,
                paddingHorizontal: 16,
              },
            ]}
          >
            {cases.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: "/(protected)/case/[id]",
                    params: { id: item.id },
                  })
                }
                style={{
                  borderWidth: 1,
                  borderColor: Colors.light.faintGrey,
                  padding: 16,
                  flexDirection: "column",
                  width: 155,
                  height: 155,
                  backgroundColor: "#FFF",
                  justifyContent: "space-between",
                  borderRadius: 8,
                }}
              >
                <TextSemiBold
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={[themeTextStylePrimary, { fontSize: 16 }]}
                >
                  {item.name}
                </TextSemiBold>
                <TextRegular
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={[themeTextStyleSecondary, { fontSize: 12 }]}
                >
                  {item.description}
                </TextRegular>
                {item.status === "reviewed" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: "4",
                      alignItems: "center",
                    }}
                  >
                    <CustomIcon
                      name="check-mark"
                      size={24}
                      color={Colors.green}
                    />
                    <TextSemiBold
                      style={{
                        color: Colors.green,
                        fontSize: 12,
                      }}
                    >
                      Reviewed by 1
                    </TextSemiBold>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: "4",
                      alignItems: "center",
                    }}
                  >
                    <CustomIcon
                      name="schedule"
                      size={24}
                      color={Colors.onlineConsultation}
                    />
                    <TextSemiBold
                      style={{
                        color: Colors.onlineConsultation,
                        fontSize: 12,
                      }}
                    >
                      Pending
                    </TextSemiBold>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={{
            borderColor: "#000",
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: Colors.dark.background,
            margin: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
          onPress={() =>
            router.push("/(protected)/(modals)/create-second-opinion")
          } // Navigate to new case screen
        >
          <TextSemiBold
            style={{
              color: "#FFF",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Start a new case
          </TextSemiBold>
        </TouchableOpacity>
      </View>

      <InfoBottomSheet ref={bottomSheetModalRef} />
    </View>
  );
};

export default SecondOpinion;
