import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import ForgetPasswordScreen from "../screens/ForgetPasswordScreen";
import colors from "../config/colors";
import routes from "./routes";

const Stack = createStackNavigator();

// Stack Navigator Between Welcome Screen, LoginScreen and RegisterScreen
const LoginNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: colors.brightred,
      headerTitleAlign: "center",
      headerBackTitleVisible: true,
    }}
  >
    <Stack.Screen name={routes.LOGIN} component={LoginScreen} options={{}} />
    <Stack.Screen
      name={routes.FORGETPASSWORD}
      component={ForgetPasswordScreen}
      options={{}}
    />
  </Stack.Navigator>
);

export default LoginNavigator;
