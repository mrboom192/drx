import { View, Text, Button } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { db } from "../../../../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import doctorsData from "@/../assets/data/doctors.json";
const publicProfiles = doctorsData;

// // Function to upload data TESTING ONLY
// const uploadPublicProfiles = async () => {
//   try {
//     const batchUpload = publicProfiles.map(async (profile: any) => {
//       const profileRef = doc(collection(db, "public_profiles"), profile.id);
//       await setDoc(profileRef, profile);
//     });

//     await Promise.all(batchUpload);
//     console.log("All profiles uploaded successfully!");
//   } catch (error) {
//     console.error("Error uploading profiles:", error);
//   }
// };

const Page = () => {
  return (
    <View>
      {/* <View>
        <Button title="Upload Public Profiles" onPress={uploadPublicProfiles} />
      </View> */}
      <Text>doctors</Text>
    </View>
  );
};

export default Page;
