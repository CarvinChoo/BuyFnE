import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";

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
      name='Listings'
      component={ListingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='ListingDetails'
      component={ListingDetailsScreen}
      options={{ headerTitle: false }}
    />
  </Stack.Navigator>
);

export default FeedNavigator;
