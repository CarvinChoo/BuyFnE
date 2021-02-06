import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import colors from "../config/colors";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: colors.brightred,
      headerTitleAlign: "center",
      headerBackTitleVisible: true,
    }}
  >
    <Stack.Screen
      name='Welcome'
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name='Login' component={LoginScreen} options={{}} />
    <Stack.Screen name='Register' component={RegisterScreen} options={{}} />
  </Stack.Navigator>
);

export default AuthNavigator;
