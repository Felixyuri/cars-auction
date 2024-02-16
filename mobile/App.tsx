// @ts-nocheck
import { StatusBar } from 'expo-status-bar';
import { TailwindProvider } from 'tailwind-rn';
import utilities from './tailwind.json';
import React from 'react';
import { Provider } from "./src/context/authContext";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Home from './src/screens/Home';
import SignUp from './src/screens/SignUp/SignUp';
import SignInToken from './src/screens/SignInToken/SignInToken';
import Dashboard from './src/screens/Dashboard/Dashboard';
import Toast from 'react-native-toast-message';

export type ScreenNames = ['Home', 'SignInToken', 'SignUp', 'Dashboard'];
export type RootStackParamList = Record<ScreenNames[number], undefined>
export type StackNavigation = NavigationProp<RootStackParamList>

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer gestureEnabled={false} >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          gestureDirection: {
            gestureResponseDistance: 50000
          }
        }}>
        <Stack.Screen name="SignInToken" component={SignInToken} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <Provider>
      <SafeAreaProvider>
        <TailwindProvider utilities={utilities}>
          <App />
          <StatusBar style="auto" />
        </TailwindProvider>
      </SafeAreaProvider>
      <Toast />
    </Provider>
  );
};