import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Image } from "expo-image";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import Colors from "@/constants/Colors";
import { TextSemiBold } from "@/components/StyledText";

const data = [
  {
    alt: "Image of Dr Abdelgawad",
    image: require("@/../assets/images/carousel/abdelgawad.jpeg"),
  },
  {
    alt: "Image of Dr Attili",
    image: require("@/../assets/images/carousel/attili.jpeg"),
  },
  {
    alt: "Image of Dr Elsayed",
    image: require("@/../assets/images/carousel/elsayed.jpeg"),
  },
  {
    alt: "Image of Dr Eltahawy",
    image: require("@/../assets/images/carousel/eltahawy.jpeg"),
  },
  {
    alt: "Image of Dr Enam",
    image: require("@/../assets/images/carousel/emam.jpeg"),
  },
  {
    alt: "Image of Dr Naga",
    image: require("@/../assets/images/carousel/naga.jpeg"),
  },
  {
    alt: "Image of Dr Radwan",
    image: require("@/../assets/images/carousel/radwan.jpeg"),
  },
  {
    alt: "Image of Dr Youssef",
    image: require("@/../assets/images/carousel/youssef.jpeg"),
  },
];

const width = Dimensions.get("window").width;

const DoctorCarousel = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <TextSemiBold style={styles.header}>Featured doctors</TextSemiBold>
      <Carousel
        ref={ref}
        autoPlay
        autoPlayInterval={3000}
        width={width}
        height={width * 0.66666}
        data={data}
        onProgressChange={progress}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxAdjacentItemScale: 0.9,
          parallaxScrollingOffset: 125,
        }}
        renderItem={({ item }) => (
          <Image
            style={styles.image}
            source={item.image}
            contentFit="contain"
            transition={250}
          />
        )}
      />
      {/* 
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      /> */}
    </View>
  );
};

export default DoctorCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 12,
    borderBottomColor: Colors.faintGrey,
    borderBottomWidth: 1,
  },
  image: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    fontSize: 16,
    marginHorizontal: 16,
  },
});
