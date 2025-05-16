import Colors from "@/constants/Colors";
import { StyleSheet, TextInput, View } from "react-native";
import { TextRegular } from "./StyledText";

type RegularTextInputProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
};

const RegularTextInput = ({
  label,
  value,
  placeholder,
  onChangeText,
}: RegularTextInputProps) => {
  return (
    <View style={input.container}>
      <TextRegular style={input.title}>{label}</TextRegular>
      <TextInput
        style={input.textInput}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.grey}
        value={value}
        onChangeText={onChangeText}
        keyboardType="default"
        autoCapitalize="none"
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
});
