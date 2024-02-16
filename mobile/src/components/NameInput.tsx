import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface NomeInputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  error: boolean
}

const NameInput: React.FC<NomeInputProps> = ({ value, setValue, error }) => {
  return (
    <TextInput
      style={styles.textInput}
      label="Nome"
      mode="flat"
      left={<TextInput.Icon icon="account" size={25} color="black" />}
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

export default NameInput;
