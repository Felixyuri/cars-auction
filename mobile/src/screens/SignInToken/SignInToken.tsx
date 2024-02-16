import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import api from "../../api";
import { useTailwind } from "tailwind-rn";
import { StackNavigation } from "../../../App";

interface SignInTokenScreenProps {
    navigation: StackNavigation
}

const SignInToken: React.FC<SignInTokenScreenProps> = ({ navigation }) => {
    const tailwind = useTailwind();

    useEffect(() => {
        const signInToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const user = await AsyncStorage.getItem("user");

                if (token && user) {
                    const userInfosParsed = JSON.parse(user);
                    await api.get(`auction/finduser/${userInfosParsed.email}`, { headers: { Authorization: `Bearer ${token}` } })
                        .then(() => navigation.navigate("Dashboard"))
                        .catch(() => navigation.navigate("Home"));
                } else {
                    navigation.navigate("Home");
                }
            } catch (e) {
                navigation.navigate("Home");
            }
        };

        signInToken();
    }, []);

    return (
        <View style={tailwind("flex-1 items-center justify-center")}>
            <ActivityIndicator color="black" size={40} />
        </View>
    );
};

export default SignInToken;
