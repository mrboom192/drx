import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { TextRegular, TextSemiBold } from "@/components/StyledText";

const Biography = ({ doctor }: { doctor: any }) => {
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  const test =
    "ASdasfjlkjlk;asfdjlk \n asdjkfll;jaksdfjl \n asdjkfll;jaksdfjl\n asdjkfll;jaksdfjl\n asdjkfll;jaksdfjl\n asdjkfll;jaksdfjl";

  return (
    <View style={{ flexDirection: "column", gap: 8 }}>
      <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
        Biography
      </TextSemiBold>
      <TextRegular
        style={{
          fontSize: 14,
          color: "#444",
          lineHeight: 20,
        }}
        numberOfLines={showFullBio ? undefined : 5}
        onTextLayout={(e) => {
          const { lines } = e.nativeEvent;
          setIsTextTruncated(lines.length > 5);
        }}
      >
        {test}
      </TextRegular>
      {isTextTruncated && !showFullBio && (
        <TouchableOpacity onPress={() => setShowFullBio(true)}>
          <TextSemiBold
            style={{
              fontSize: 14,
              color: "#000",
              marginTop: 8,
            }}
          >
            Show more
          </TextSemiBold>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Biography;
