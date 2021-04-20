import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListingsScreen from "../screens/ListingsScreen";
import CategoryListingsScreen from "../screens/CategoryListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import GroupBuyCheckoutScreen from "../screens/GroupBuyCheckoutScreen";
import GroupBuyOrderConfirmedScreen from "../screens/GroupBuyOrderConfirmedScreen";
import routes from "./routes";

const Stack = createStackNavigator();

// Stack navigator between ListingsScreen and ListingDetailsScreen
const FeedNavigator = () => (
  <Stack.Navigator
    mode='card'
    screenOptions={{
      headerTitleAlign: "center",
      headerBackTitleVisible: true,
    }}
  >
    <Stack.Screen
      name={routes.LISTINGS}
      component={ListingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.CATEGORY}
      component={CategoryListingsScreen}
      options={({ route }) => ({
        title: route.params.title,

        headerBackTitleVisible: false,
      })}
    />
    <Stack.Screen
      name={routes.LISTING_DETAILS}
      component={ListingDetailsScreen}
      options={{ headerTitle: false }}
    />
    <Stack.Screen
      name={routes.GBCHECKOUT}
      component={GroupBuyCheckoutScreen}
      options={{ headerBackTitleVisible: false }}
    />
    <Stack.Screen
      name={routes.GBORDERCONFIRMED}
      component={GroupBuyOrderConfirmedScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default FeedNavigator;
