import axios from "axios";
import { createContext } from "react"
import { setCookie } from "nookies";
import Router from "next/router";
import { api } from "../services/api";
import { toast } from "react-toastify";

type AuthContextType = {
    signIn: (data: SignInData) => Promise<void>
}

type SignInData = {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
    async function signIn({ email, password }: SignInData) {
        await axios.post(
            `http://localhost:3000/auth/login`,
            { email: email, password: password },
            { timeout: 30000 }
        )
        .then(({data}) => {
            setCookie(undefined, 'carsauth.token', data.access_token, {
                maxAge: 60 * 60 * 1, // 1 hour
            });

            api.defaults.headers['Authorization'] = `Bearer ${data.access_token}`;
            localStorage.setItem('user', JSON.stringify(data.user));

            Router.push('/dashboard');
        })
        .catch(({response}) => {
            toast.error(response.data.message, { autoClose: 1000 });
        });
    }

    return (
        <AuthContext.Provider value={{ signIn }}>
            {children}
        </AuthContext.Provider>
    )
}