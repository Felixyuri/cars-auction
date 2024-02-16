import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface PasswordInputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  setValue,
  showPassword,
  setShowPassword,
  error
}) => {
  return (
    <TextInput
      style={styles.textInput}
      label="Senha"
      value={value}
      onChangeText={(text) => setValue(text)}
      left={<TextInput.Icon icon="lock" size={25} color="black" />}
      secureTextEntry={showPassword}
      error={error}
      right={
        showPassword ? (
          <TextInput.Icon
            icon="eye"
            size={25}
            color="black"
            onPress={() => setShowPassword(!showPassword)}
          />
        ) : (
          <TextInput.Icon
            icon="eye-off"
            size={25}
            color="black"
            onPress={() => setShowPassword(!showPassword)}
          />
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 10,
    width: '70%'
  },
});

export default PasswordInput;
