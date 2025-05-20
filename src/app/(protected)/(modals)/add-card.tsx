import Footer from "@/components/AddFooter";
import PageScrollView from "@/components/PageScrollView";
import RegularTextInput from "@/components/RegularTextInput";
import { TextRegular } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import { useUserData } from "@/stores/useUserStore";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { db } from "../../../../firebaseConfig";

const AddCard = () => {
  const { height } = useGradualAnimation();
  const { confirmSetupIntent } = useStripe();

  const [cardholderName, setCardholderName] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const userData = useUserData();

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
    };
  }, []);

  const handleAddCard = async () => {
    if (!cardComplete || !cardholderName || !userData?.uid) {
      Alert.alert("Please complete the form.");
      return;
    }

    setSubmitting(true);

    try {
      const customerDoc = await getDoc(
        doc(db, "stripe_customers", userData.uid)
      );
      const { setup_secret } = customerDoc.data() || {};

      if (!setup_secret) {
        throw new Error("Missing setup secret");
      }

      const { setupIntent, error } = await confirmSetupIntent(setup_secret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            name: cardholderName,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Add to Firestore to trigger backend listener
      await addDoc(
        collection(db, "stripe_customers", userData.uid, "payment_methods"),
        {
          id: setupIntent.paymentMethod?.id,
        }
      );

      Alert.alert("Card added!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <PageScrollView>
        <RegularTextInput
          label="Name on Card"
          value={cardholderName}
          onChangeText={setCardholderName}
          placeholder="e.g. John Doe"
        />
        <TextRegular style={styles.cardFieldLabel}>Card details</TextRegular>
        <View style={styles.cardFieldContainer}>
          <CardField
            postalCodeEnabled={true}
            placeholders={{ number: "4242 4242 4242 4242" }}
            cardStyle={{ backgroundColor: "#FFFFFF", textColor: "#000000" }}
            style={{ width: "100%", height: 14, marginVertical: 20 }}
            onCardChange={(cardDetails) => {
              setCardComplete(cardDetails.complete);
            }}
          />
        </View>
      </PageScrollView>

      <Footer
        keyboardHeightShared={height}
        canSubmit={cardComplete && !!cardholderName}
        submitting={submitting}
        handleSubmit={handleAddCard}
      />

      <Animated.View style={fakeView} />
    </View>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardFieldLabel: {
    marginBottom: 8,
    fontSize: 16,
    color: "#000",
  },
  cardFieldContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
  },
});
