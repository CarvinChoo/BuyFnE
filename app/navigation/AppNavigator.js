import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ListingEditScreen from "../screens/ListingEditScreen";
import FeedNavigator from "./FeedNavigator";
import AccountNavigator from "./AccountNavigator";
import CartNavigator from "./CartNavigator";
import NewListingButton from "./NewListingButton";
import CartButton from "./CartButton";
import routes from "./routes";
import AuthApi from "../api/auth";
import colors from "../config/colors";

function AppNavigator() {
  const Tab = createBottomTabNavigator();
  const { userType } = useContext(AuthApi.AuthContext);

  // Tab Navigator Between FeedNavigator, ListingEditScreen and AccountScreen
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: { height: 55 }, // changes height of Tab Bar
        labelStyle: {
          fontSize: 15, // Changes Font Size of Tab Bar
        },
        // set style options for all tabs
        activeBackgroundColor: colors.whitegrey, // on tab bg color
        //activeTintColor: colors.darkgray, // on tab text color
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
            tabBarVisible: navigation.dangerouslyGetState().routes[1].state
              ? navigation.dangerouslyGetState().routes[1].state.index == 0
                ? true
                : false
              : true,
            tabBarButton: () =>
              navigation.dangerouslyGetState().routes[1].state ? (
                navigation.dangerouslyGetState().routes[2].state ? (
                  navigation.dangerouslyGetState().routes[1].state.index > 0 ||
                  navigation.dangerouslyGetState().routes[2].state.index > 0 ? (
                    <CartButton style={{ bottom: 0 }} />
                  ) : (
                    <CartButton
                      onPress={() => navigation.navigate(routes.CartNav)}
                    />
                  )
                ) : navigation.dangerouslyGetState().routes[1].state.index >
                  0 ? (
                  <CartButton style={{ bottom: 0 }} />
                ) : (
                  <CartButton
                    onPress={() => navigation.navigate(routes.CartNav)}
                  />
                )
              ) : navigation.dangerouslyGetState().routes[2].state ? (
                navigation.dangerouslyGetState().routes[2].state.index > 0 ? (
                  <CartButton style={{ bottom: 0 }} />
                ) : (
                  <CartButton
                    onPress={() => navigation.navigate(routes.CartNav)}
                  />
                )
              ) : (
                <CartButton
                  onPress={() => navigation.navigate(routes.CartNav)}
                />
              ),
            //setting Icon for tab
          })}
        />
      )}
      <Tab.Screen
        name={routes.ACCOUNT}
        component={AccountNavigator} // Stack navigator between AccountScreen and MessagesScreen
        options={({ navigation }) => ({
          tabBarVisible: navigation.dangerouslyGetState().routes[2].state
            ? navigation.dangerouslyGetState().routes[2].state.index == 0
              ? true
              : false
            : true,

          tabBarIcon: (
            { color, size } // setting size and color to react-native 's suggestion
          ) => (
            <MaterialCommunityIcons name='account' color={color} size={size} />
          ),
        })}
      />
    </Tab.Navigator>
  );
  ////////////////////////////////////////////////////////////////////////////////
}
export default AppNavigator;
