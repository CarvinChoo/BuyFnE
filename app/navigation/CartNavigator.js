import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ShoppingCartScreen from "../screens/ShoppingCartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderConfirmedScreen from "../screens/OrderConfirmedScreen";
import routes from "./routes";
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
    <Stack.Screen name={routes.SHOPPINGCART} component={ShoppingCartScreen} />
    <Stack.Screen
      name={routes.CHECKOUT}
      component={CheckoutScreen}
      options={{ headerBackTitleVisible: false }}
    />
    <Stack.Screen
      name={routes.ORDERCONFIRMED}
      component={OrderConfirmedScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default CartNavigator;
