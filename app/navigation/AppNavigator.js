import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ListingEditScreen from "../screens/ListingEditScreen";
import FeedNavigator from "./FeedNavigator";
import AccountNavigator from "./AccountNavigator";
import CartNavigator from "./CartNavigator";
import NewListingButton from "./NewListingButton";
import CartButton from "./CartButton";
import routes from "./routes";

const Tab = createBottomTabNavigator();

// Tab Navigator Between FeedNavigator, ListingEditScreen and AccountScreen
const AppNavigator = ({ userType }) => (
  <Tab.Navigator
    tabBarOptions={{
      style: { height: 55 }, // changes height of Tab Bar
      labelStyle: {
        fontSize: 15, // Changes Font Size of Tab Bar
      },
      // set style options for all tabs
      // activeBackgroundColor: "tomato", // on tab bg color
      // activeTintColor: "white", // on tab text color
      // inactiveBackgroundColor: "#eee", //off tab bg color
      // inactivateTintColor: "black", // off tab text color
    }}
  >
    <Tab.Screen
      name={routes.LISTINGS}
      component={FeedNavigator} // Stack navigator between ListingsScreen and ListingDetailsScreen
      options={{
        //setting Icon for tab
        tabBarIcon: (
          { color, size } // setting size and color to react-native 's suggestion
        ) => <MaterialCommunityIcons name='home' color={color} size={size} />,
      }}
    />
    {/* Add Listings Navigation */}
    {userType === 2 && (
      <Tab.Screen
        name={routes.LISTING_EDIT}
        component={ListingEditScreen}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton
              onPress={() => navigation.navigate(routes.LISTING_EDIT)}
            />
          ),
          //setting Icon for tab
          tabBarIcon: (
            { color, size } // setting size and color to react-native 's suggestion
          ) => (
            <MaterialCommunityIcons
              name='plus-circle'
              color={color}
              size={size}
            />
          ),
        })}
      />
    )}

    {/* Cart Navigation */}
    {userType == 1 && (
      <Tab.Screen
        name={routes.CartNav}
        component={CartNavigator}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <CartButton onPress={() => navigation.navigate(routes.CartNav)} />
          ),
          //setting Icon for tab
        })}
      />
    )}
    <Tab.Screen
      name={routes.ACCOUNT}
      component={AccountNavigator} // Stack navigator between AccountScreen and MessagesScreen
      options={{
        //setting Icon for tab
        tabBarIcon: (
          { color, size } // setting size and color to react-native 's suggestion
        ) => (
          <MaterialCommunityIcons name='account' color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);
////////////////////////////////////////////////////////////////////////////////

export default AppNavigator;
