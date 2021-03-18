import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ShoppingCartScreen from "../screens/ShoppingCartScreen";

const Stack = createStackNavigator();

// Stack navigator between AppNavigator and ShoppingCartScreen
const CartNavigator = () => (
  <Stack.Navigator
    mode='card'
    screenOptions={{
      headerTitleAlign: "center",
      headerBackTitleVisible: true,
    }}
  >
    <Stack.Screen name='Shopping Cart' component={ShoppingCartScreen} />
  </Stack.Navigator>
);

export default CartNavigator;
