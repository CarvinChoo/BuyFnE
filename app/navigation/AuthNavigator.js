import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AppNavigator from "./AppNavigator";
import LoginNavigator from "./LoginNavigator";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import colors from "../config/colors";
import routes from "./routes";

const Stack = createStackNavigator();

// Stack Navigator Between Welcome Screen, LoginScreen and RegisterScreen
const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: colors.brightred,
      headerTitleAlign: "center",
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen
      name={routes.AppNav}
      component={AppNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.WELCOME}
      component={WelcomeScreen}
      options={{
        headerStyle: {
          height: 75,
        },
      }}
    />
    <Stack.Screen
      name={routes.LoginNav}
      component={LoginNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.REGISTER}
      component={RegisterScreen}
      options={{}}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
