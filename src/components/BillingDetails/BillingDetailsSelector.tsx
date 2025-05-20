import Colors from "@/constants/Colors";
import { BillingDetails } from "@stripe/stripe-react-native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextSemiBold } from "../StyledText";
import BillingAddress from "./BillingAddress";
import BillingDetailsForm from "./BillingDetailsForm";

const mockBillingDetails: BillingDetails[] = [
  {
    address: {
      city: "San Francisco",
      country: "US",
      line1: "123 Main St",
      line2: "Apt 4B",
      postalCode: "94105",
      state: "CA",
    },
    name: "John Doe",
    phone: "+14155552671",
    email: "john@gmail.com",
  },
  {
    address: {
      city: "New York",
      country: "US",
      line1: "456 Elm St",
      line2: "Suite 5A",
      postalCode: "10001",
      state: "NY",
    },
    name: "Jane Smith",
    phone: "+14155552672",
    email: "jane@gmail.com",
  },
];

const initBillingDetails: BillingDetails = {
  address: {
    city: "",
    country: "",
    line1: "",
    line2: "",
    postalCode: "",
    state: "",
  },
  name: "",
  phone: "",
  email: "",
};

const BillingDetailsSelector = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [form, setForm] = useState<BillingDetails>(initBillingDetails);
  const [formVisible, setFormVisible] = useState(false);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>(
    mockBillingDetails[0]
  );

  const handleAddressSelect = (index: number) => {
    setCurrentIndex(index);
    setBillingDetails(mockBillingDetails[index]);
  };

  const updateBillingForm = (updates: Partial<BillingDetails>) => {
    setForm((prev) => ({
      ...prev,
      ...updates,
      address: {
        ...prev.address,
        ...(updates.address || {}),
      },
    }));
  };

  const handleFormVisibility = () => {
    setFormVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <TextSemiBold style={styles.billingAddressTitle}>
        Billing address
      </TextSemiBold>

      {formVisible ? (
        <BillingDetailsForm form={form} updateForm={updateBillingForm} />
      ) : (
        <>
          <View style={styles.addressesContainer}>
            {mockBillingDetails.map(
              (billingDetails: BillingDetails, index: number) => (
                <BillingAddress
                  key={index}
                  billingDetails={billingDetails}
                  isSelected={currentIndex === index}
                  onPress={() => handleAddressSelect(index)}
                  showBorder={index < mockBillingDetails.length - 1}
                />
              )
            )}
          </View>
          <TouchableOpacity onPress={handleFormVisibility}>
            <TextSemiBold style={styles.visibilityButtonText}>
              + Use a different address
            </TextSemiBold>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default BillingDetailsSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
  },
  billingAddressTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  addressesContainer: {
    flexDirection: "column",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.faintGrey,
  },
  visibilityButtonText: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
  },
});
