import React, { useState, useContext } from "react";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useTailwind } from "tailwind-rn";
import { Context } from "../../context/authContext";
import NameInput from "../../components/NameInput";
import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";
import { Controller, useForm } from "react-hook-form";
import { StackNavigation } from "../../../App";
import Toast from "react-native-toast-message";

interface SingUpScreenProps {
  navigation: StackNavigation
}

const SignUp: React.FC<SingUpScreenProps> = ({ navigation }) => {
  const { createUser } = useContext(Context);
  const tailwind = useTailwind();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const [showPassword, setShowPassword] = useState(true);

  const onSubmit = async (data: any) => {
    const { email, password, name } = data;

    try {
      await createUser(name, email, password);
      Toast.show({
        type: 'success',
        text1: 'Usuário cadastrado com sucesso!',
        visibilityTime: 4000,
      });
      navigation.navigate('Home');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar usuário',
        text2: error,
        visibilityTime: 4000,
      });
    }
  }

  return (
    <TouchableWithoutFeedback
      touchSoundDisabled
      onPress={() => Keyboard.dismiss()}
    >
      <View style={tailwind("flex-1 items-center justify-center")}>
        <Text style={tailwind("text-4xl font-bold mb-4")}>Criar conta</Text>

        <Controller
          control={control}
          render={({ field }) => (
            <NameInput
              value={field.value}
              setValue={field.onChange}
              error={!!errors.name}
            />
          )}
          name='name'
          rules={{ required: 'Campo obrigatório' }}
        />
        {errors.name && typeof errors.name.message === 'string' && (
          <Text style={tailwind('text-red-500 mb-2')}>{errors.name.message}</Text>
        )}

        <Controller
          control={control}
          render={({ field }) => (
            <EmailInput
              value={field.value}
              setValue={field.onChange}
              error={!!errors.email}
            />
          )}
          name="email"
          rules={{ required: 'Campo obrigatório' }}
        />
        {errors.email && typeof errors.email.message === 'string' && (
          <Text style={tailwind('text-red-500 mb-2')}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          render={({ field }) => (
            <PasswordInput
              value={field.value}
              setValue={field.onChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={!!errors.password}
            />
          )}
          name="password"
          rules={{ required: 'Campo obrigatório' }}
        />
        {errors.password && typeof errors.password.message === 'string' && (
          <Text style={tailwind('text-red-500 mb-2')}>{errors.password.message}</Text>
        )}

        <Button
          style={tailwind("p-2 my-4 w-1/2")}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Criar
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text>
            Já tem uma conta?{" "}
            <Text style={tailwind("font-bold text-indigo-700")}>Faça o login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
