import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{}}>
    <Stack.Screen
      name='Welcome'
      component={WelcomeScreen}
      options={{}}
      options={{ headerShown: false }}
    />
    <Stack.Screen name='Login' component={LoginScreen} options={{}} />
    <Stack.Screen name='Register' component={RegisterScreen} options={{}} />
  </Stack.Navigator>
);

export default AuthNavigator;
