import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ListingsScreen from "../screens/ListingsScreen";
import ListingEditScreen from "../screens/ListingEditScreen";
import AccountScreen from "../screens/AccountScreen";

/////////////////////Tab Navigator/////////////////////////////////////////////
const Tab = createBottomTabNavigator();
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
    <Tab.Screen name='Listings' component={ListingsScreen} />
    <Tab.Screen name='ListingEdit' component={ListingEditScreen} />
    <Tab.Screen name='Account' component={AccountScreen} />
  </Tab.Navigator>
);
////////////////////////////////////////////////////////////////////////////////

export default AppNavigator;
