import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ListingEditScreen from "../screens/ListingEditScreen";
import AccountScreen from "../screens/AccountScreen";
import FeedNavigator from "./FeedNavigator";
import AccountNavigator from "./AccountNavigator";

const Tab = createBottomTabNavigator();

// Tab Navigator Between FeedNavigator, ListingEditScreen and AccountScreen
const AppNavigator = () => (
  <Tab.Navigator
    tabBarOptions={
      {
        // set style options for all tabs
        // activeBackgroundColor: "tomato", // on tab bg color
        // activeTintColor: "white", // on tab text color
        // inactiveBackgroundColor: "#eee", //off tab bg color
        // inactivateTintColor: "black", // off tab text color
      }
    }
  >
    <Tab.Screen
      name='FeedNavigator'
      component={FeedNavigator} // Stack navigator between ListingsScreen and ListingDetailsScreen
    />
    <Tab.Screen name='ListingEdit' component={ListingEditScreen} />
    <Tab.Screen
      name='AccountNavigator'
      component={AccountNavigator} // Stack navigator between AccountScreen and MessagesScreen
    />
  </Tab.Navigator>
);
////////////////////////////////////////////////////////////////////////////////

export default AppNavigator;
