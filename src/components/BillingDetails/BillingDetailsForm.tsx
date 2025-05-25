import { BillingDetails } from "@stripe/stripe-react-native";
import React from "react";
import { View } from "react-native";
import RegularTextInput from "../RegularTextInput";

const BillingDetailsForm = ({
  form,
  updateForm,
}: {
  form: BillingDetails;
  updateForm: (fields: Partial<BillingDetails>) => void;
}) => {
  return (
    <View>
      <RegularTextInput
        label="Full Name"
        value={form.name || ""}
        placeholder="e.g. John Doe"
        onChangeText={(text) => updateForm({ name: text })}
      />
      <RegularTextInput
        label="Phone"
        value={form.phone || ""}
        placeholder="e.g. +1234567890"
        onChangeText={(text) => updateForm({ phone: text })}
      />
      <RegularTextInput
        label="Email"
        value={form.email || ""}
        placeholder="e.g. user@example.com"
        onChangeText={(text) => updateForm({ email: text })}
      />
      <RegularTextInput
        label="Address Line 1"
        value={form.address?.line1 || ""}
        placeholder="e.g. 123 Main St"
        onChangeText={(text) => updateForm({ address: { line1: text } })}
      />
      <RegularTextInput
        label="Address Line 2 (optional)"
        value={form.address?.line2 || ""}
        placeholder="Apt, Suite, etc."
        onChangeText={(text) => updateForm({ address: { line2: text } })}
      />
      <RegularTextInput
        label="City"
        value={form.address?.city || ""}
        placeholder="e.g. New York"
        onChangeText={(text) => updateForm({ address: { city: text } })}
      />
      <RegularTextInput
        label="State / Province"
        value={form.address?.state || ""}
        placeholder="e.g. NY or California"
        onChangeText={(text) => updateForm({ address: { state: text } })}
      />
      <RegularTextInput
        label="Postal Code"
        value={form.address?.postalCode || ""}
        placeholder="e.g. 10001"
        keyboardType="numeric"
        onChangeText={(text) => updateForm({ address: { postalCode: text } })}
      />
      <RegularTextInput
        label="Country"
        value={form.address?.country || ""}
        placeholder="2-letter code (e.g. US, CA)"
        onChangeText={(text) => updateForm({ address: { country: text } })}
      />
    </View>
  );
};

export default BillingDetailsForm;
