import createContext from "./createContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "react";

import api from "../api";

interface State { }

interface Action {
  type: string;
  payload?: any;
}

const initialState: State = {};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    default:
      return state;
  }
};

const createUser = (dispatch: Dispatch<Action>) => {
  return async (name: string, email: string, password: string) => {
    try {
      await api.post("auth/create", {
        name: name,
        email: email,
        password: password,
      })
        .catch(({ response }) => {
          throw response.data.message;
        });
    } catch (error) {
      throw error;
    }
  };
};

const loginUser = (dispatch: Dispatch<Action>) => {
  return async (email: string, password: string) => {
    try {
      await api.post("auth/login", {
        email: email,
        password: password,
      }).then(async ({ data }) => {
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      }).catch(({ response }) => {
        throw response.data.message;
      });
    } catch (error) {
      throw error;
    }
  };
};

export const { Context, Provider } = createContext(
  reducer,
  { createUser, loginUser },
  initialState
);
