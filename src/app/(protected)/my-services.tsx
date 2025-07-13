import { View } from "react-native";
import React, { useEffect, useState } from "react";
import ListPage from "@/components/ListPage";
import { fetchUsersPublicProfile } from "@/api/publicProfile";
import { PublicProfile } from "@/types/publicProfile";

const MyServicesPage = () => {
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(
    null
  );
  const services = publicProfile?.services || [];
  const radiologyPrice = publicProfile?.radiologyPrice;
  const secondOpinionPrice = publicProfile?.secondOpinionPrice;
  const consultationPrice = publicProfile?.consultationPrice;
  const weightLossPrice = publicProfile?.weightLossPrice;
  const inHomeCarePrice = publicProfile?.inHomeCarePrice;

  const servicesList = [
    {
      id: "consultation",
      priceLabel: "consultationPrice",
      title: "Consultations",
      description: `Provide general health advice via virtual appointments.`,
    },
    {
      id: "radiology",
      priceLabel: "radiologyPrice",
      title: "Radiology review",
      description: `Review diagnoses or treatment plans to offer expert insight.`,
    },
    {
      id: "secondOpinion",
      priceLabel: "secondOpinionPrice",
      title: "Second opinion",
      description: `Interpret and provide insight on imaging results.`,
    },
    {
      id: "weightLoss",
      priceLabel: "weightLossPrice",
      title: "Weight Loss Program",
      description: `Support patients in their weight loss journey with personalized plans.`,
    },
    {
      id: "inHomeCare",
      priceLabel: "inHomeCarePrice",
      title: "In-home Care",
      description: `Offer medical support through home visits or remote monitoring.`,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Fetch the user's public profile
      // This will be used to display the services they offer
      try {
        const res = await fetchUsersPublicProfile();

        if (!res) {
          throw new Error("No public profile found");
        }

        setPublicProfile(res.data() as PublicProfile);
      } catch (error) {
        console.error("Error fetching public profile:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ListPage>
      <View style={{ paddingHorizontal: 16 }}></View>
    </ListPage>
  );
};

export default MyServicesPage;
