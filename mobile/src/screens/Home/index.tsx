import React, { useState, useContext } from "react";
import {
	TouchableOpacity,
	Keyboard,
	TouchableWithoutFeedback,
	Image,
	View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useTailwind } from "tailwind-rn";
import { Context } from "../../context/authContext";
import { Controller, useForm } from "react-hook-form";
import { StackNavigation } from "../../../App";
import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";
import Toast from "react-native-toast-message";

interface HomeScreenProps {
	navigation: StackNavigation
}

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
	const { loginUser } = useContext(Context);
	const tailwind = useTailwind();
	const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm();

	const [showPassword, setShowPassword] = useState(true);

	const onSubmit = async (data: any) => {
		const { email, password } = data;

		try {
			await loginUser(email, password);
			navigation.navigate('Dashboard');
		} catch (error: any) {
			Toast.show({
				type: 'error',
				text1: 'Erro de login',
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
				<Image
					source={require('../../assets/icone-leilao.jpg')}
					style={{ width: 100, height: 100, borderRadius: 100 }}
				/>

				<Text style={tailwind("text-4xl font-bold mb-4 mt-4")}>Leilão de carros</Text>

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
					rules={{ required: "Campo obrigatório" }}
				/>
				{errors.password && typeof errors.password.message === 'string' && (
					<Text style={tailwind('text-red-500 mb-2')}>{errors.password.message}</Text>
				)}

				<Button
					mode="contained"
					style={tailwind("p-2 my-4 w-1/2")}
					onPress={handleSubmit(onSubmit)}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Logando...' : 'Login'}
				</Button>

				<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
					<Text>
						Não tem uma conta?{" "}
						<Text style={tailwind("font-bold text-indigo-700")}>Crie uma</Text>
					</Text>
				</TouchableOpacity>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default Home;
