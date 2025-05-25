import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import React from "react";

// Grabs the publishable key and merchant ID from app.json
const merchantId = Constants.expoConfig?.plugins?.find(
  (p) => p[0] === "@stripe/stripe-react-native"
)?.[1]?.merchantIdentifier;

if (!merchantId) {
  throw new Error(
    "Merchant ID is not defined. Please check your Expo configuration."
  );
}

const ExpoStripeProvider = (
  props: Omit<
    React.ComponentProps<typeof StripeProvider>,
    "publishableKey" | "merchantIdentifier"
  >
) => {
  const stripePlugin = Constants.expoConfig?.plugins?.find(
    (p) => Array.isArray(p) && p[0] === "@stripe/stripe-react-native"
  );

  const publishableKey = stripePlugin?.[1]?.publishableKey;
  const merchantId = stripePlugin?.[1]?.merchantIdentifier;

  if (!publishableKey || !merchantId) {
    throw new Error(
      "Stripe publishable key or merchant ID is missing in app.json."
    );
  }

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier={merchantId}
      urlScheme={Linking.createURL("/")?.split(":")[0]}
      {...props}
    />
  );
};

export default ExpoStripeProvider;
