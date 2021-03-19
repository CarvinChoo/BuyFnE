import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ListingsHistoryScreen from "../screens/ListingsHistoryScreen";
const Stack = createStackNavigator();

// Stack navigator between AccountScreen and MessagesScreen
const AccountNavigator = () => (
  <Stack.Navigator
    mode='card'
    screenOptions={{
      headerTitleAlign: "center",
      headerBackTitleVisible: true,
    }}
  >
    <Stack.Screen name='Account' component={AccountScreen} />
    {/* Add Stack Screen for Profile
    Add Stack Screen for myListings
    Add Stack Screen for GroupBuy
    Add Stack Screen for Watchlist
    Add Stack Screen for Order History */}
    <Stack.Screen name='My Listings' component={ListingsHistoryScreen} />
    <Stack.Screen name='Messages' component={MessagesScreen} />
    {/* Add Stack Screen for FAQ */}
  </Stack.Navigator>
);

export default AccountNavigator;
