import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ListingsHistoryScreen from "../screens/ListingsHistoryScreen";
import AccountManagementScreen from "../screens/AccountManagementScreen";
import OrderHistoryNavigator from "../navigation/OrderHistoryNavigator";
import PersonalGroupBuysScreen from "../screens/PersonalGroupBuysScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import MerchantRegisterScreen from "../screens/MerchantRegisterScreen";

import routes from "./routes";
const Stack = createStackNavigator();

// Stack navigator between AccountScreen and MessagesScreen
const AccountNavigator = () => (
  <Stack.Navigator
    mode='card'
    screenOptions={{
      headerTitleAlign: "center",
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen name={routes.ACCOUNT} component={AccountScreen} />
    {/* Add Stack Screen for Profile
    Add Stack Screen for myListings
    Add Stack Screen for Watchlist
    Add Stack Screen for Order History */}
    <Stack.Screen
      name={routes.MERCHANTREGISTER}
      component={MerchantRegisterScreen}
    />
    {/* GroupBuys Section */}
    <Stack.Screen
      name={routes.MYGROUPBUYS}
      component={PersonalGroupBuysScreen}
    />
    <Stack.Screen
      name={routes.LISTING_DETAILS}
      component={ListingDetailsScreen}
      options={{ headerTitle: false }}
    />
    {/* GroupBuys Section End*/}
    <Stack.Screen
      name={routes.ORDERHISTORY}
      component={OrderHistoryNavigator}
    />
    <Stack.Screen
      name={routes.LISTINGSHISTORY}
      component={ListingsHistoryScreen}
    />
    <Stack.Screen name={routes.MESSAGES} component={MessagesScreen} />
    <Stack.Screen
      name={routes.ACCOUNTMANAGEMENT}
      component={AccountManagementScreen}
    />
    {/* Add Stack Screen for FAQ */}
  </Stack.Navigator>
);

export default AccountNavigator;
