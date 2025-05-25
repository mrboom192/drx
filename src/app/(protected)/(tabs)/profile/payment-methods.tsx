import IconButton from "@/components/IconButton";
import PageScrollView from "@/components/PageScrollView";
import { router, Stack } from "expo-router";
import React from "react";
import { Text } from "react-native";

const PaymentMethods = () => {
  return (
    <PageScrollView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <IconButton
              name="add"
              onPress={() =>
                router.push({
                  pathname: "/(protected)/(modals)/add-card",
                  params: { mode: "add", allergyId: "" },
                })
              }
            />
          ),
        }}
      />
      <Text>PaymentMethods</Text>
    </PageScrollView>
  );
};

export default PaymentMethods;
