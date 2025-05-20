import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { useState } from "react";
import { Button } from "react-native";

async function fetchPaymentSheetParams(amount: number): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}> {
  return fetch("https://example.com/payment-sheet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
    }),
  }).then((response) => response.json());
}

const CheckoutForm = ({ amount }: { amount: number }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams(amount);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Drx Genius LLC",

      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set 'allowsDelayedPaymentMethods' to true if your business calls
      // methods that complete payment after a delay (like SEPA Debit or BACS Debit)
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
        email: "jenny.rosen@example.com",
        phone: "+14155551234",
      },
      returnURL: Linking.createURL("stripe-redirect"),

      // Enable apple pay
      applePay: {
        merchantCountryCode: "US",
      },
    });

    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("Success! Your order is confirmed.");
    }
  };

  // Should initiate payment sheet when the component mounts
  return (
    <>
      <Button
        title="Initiate Payment"
        onPress={initializePaymentSheet}
        // disabled={loading}
      />
      <Button
        title="Open Payment Sheet"
        onPress={openPaymentSheet}
        // disabled={!loading}
      />
    </>
  );
};

export default CheckoutForm;
