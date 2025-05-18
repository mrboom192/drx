import Colors from "@/constants/Colors";
import { StyleSheet, TextInput, View } from "react-native";
import { TextRegular } from "./StyledText";

type RegularTextInputProps = {
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  onChangeText: (text: string) => void;
  multiline?: boolean;
};

const RegularTextInput = ({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = "default",
  multiline = false,
}: RegularTextInputProps) => {
  return (
    <View style={input.container}>
      <TextRegular style={input.title}>{label}</TextRegular>
      <TextInput
        style={[input.textInput, multiline && input.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor={Colors.lightText}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        multiline={multiline}
      />
    </View>
  );
};

export default RegularTextInput;

const input = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
  },
  textInput: {
    borderColor: Colors.light.faintGrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
