import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface EmailInputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  error: boolean
}

const EmailInput: React.FC<EmailInputProps> = ({ value, setValue, error }) => {
  return (
    <TextInput
      style={styles.textInput}
      label="Email"
      mode="flat"
      left={<TextInput.Icon icon="at" size={25} color="black" />}
      value={value}
      error={error}
      onChangeText={(text) => setValue(text)}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 10,
    width: '70%'
  },
});

export default EmailInput;
