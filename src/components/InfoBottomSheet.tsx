import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import Colors from "@/constants/Colors";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeInLeft,
  FadeOutRight,
} from "react-native-reanimated";

interface Props {}

const InfoBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({}: Props, ref) => {
    const colorScheme = useColorScheme();
    const snapPoints = useMemo(() => ["50%"], []);
    const [page, setPage] = useState(1);
    const [oldPage, setOldPage] = useState(-1);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={1}
        />
      ),
      []
    );

    // Function to change page while tracking previous state
    const changePage = (newPage: number) => {
      setOldPage(page);
      setPage(newPage);
    };

    return (
      <BottomSheetModal
        style={[
          {
            backgroundColor:
              colorScheme === "light"
                ? Colors.light.background
                : Colors.dark.background,
          },
          styles.sheetContainer,
        ]}
        backgroundStyle={{
          backgroundColor:
            colorScheme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        }}
        snapPoints={snapPoints}
        index={1}
        ref={ref}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: Colors.light.grey }}
        enablePanDownToClose={true}
      >
        <BottomSheetView style={{ flex: 1, alignItems: "center" }}>
          <Animated.View
            key={page} // Ensures animation is triggered on state change
            entering={FadeInRight}
            exiting={FadeOutLeft}
          >
            {page === 1 ? (
              /** Page 1 - Info */
              <>
                <Image
                  source={require("@/../assets/images/Group.png")}
                  style={styles.image}
                />
                <Text style={{ fontFamily: "dm-sb", color: "#FFF" }}>INFO</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => changePage(2)} // Go to Page 2
                >
                  <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
              </>
            ) : page === 2 ? (
              /** Page 2 - Search */
              <>
                <Text
                  style={{
                    fontFamily: "dm-sb",
                    color: "#FFF",
                    fontSize: 18,
                    marginBottom: 10,
                  }}
                >
                  Search Results
                </Text>
                <Text style={{ color: "#FFF", fontSize: 14 }}>
                  Displaying results here...
                </Text>
                <TouchableOpacity
                  style={[styles.button, { marginTop: 20 }]}
                  onPress={() => changePage(3)} // Go to Page 3
                >
                  <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { marginTop: 10 }]}
                  onPress={() => changePage(1)} // Back to Page 1
                >
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
              </>
            ) : (
              /** Page 3 - Details */
              <>
                <Text
                  style={{
                    fontFamily: "dm-sb",
                    color: "#FFF",
                    fontSize: 18,
                    marginBottom: 10,
                  }}
                >
                  Doctor Details
                </Text>
                <Text style={{ color: "#FFF", fontSize: 14 }}>
                  More details about the doctor...
                </Text>
                <TouchableOpacity
                  style={[styles.button, { marginTop: 20 }]}
                  onPress={() => changePage(2)} // Back to Page 2
                >
                  <Text style={styles.buttonText}>Back to Search</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  sheetContainer: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  image: {
    width: 150,
    height: 120.8,
    marginBottom: 10,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#FFF",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "dm-sb",
    fontSize: 16,
  },
});

export default InfoBottomSheet;
