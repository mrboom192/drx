import PageScrollView from "@/components/PageScrollView";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import React from "react";

const BookMarked = () => {
  return (
    <PageScrollView>
      <TextSemiBold
        style={{
          fontSize: 16,
          textAlign: "center",
          color: Colors.grey,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        You have no bookmarked doctors.
      </TextSemiBold>
    </PageScrollView>
  );
};

export default BookMarked;
