import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "./app/components/Screen";

const Link = () => {
  const navigation = useNavigation(); // using a react-navigation hook to get access to "navigation" property
  return (
    <Button title='Click' onPress={() => navigation.navigate("TweetDetails")} />
  );
};

const Tweets = (
  { navigation } // navigation is only availables to components declared as Stack.Screen, child components of Stack.Screen will not get navigation prop
) => (
  // storing a page into a function
  <Screen>
    <Text>Tweets</Text>
    {/* <Link /> //child component */}
    <Button
      title='View Tweet'
      // navigates to instance of screen, is already there, no duplication
      onPress={() => navigation.navigate("TweetDetails", { id: 1 })} // pass 1 or more key-value pair , can pass entire tweet object into next screen
    />

    {/* <Button
      title='View Tweet'
      onPress={() => navigation.push("Tweets")} // duplicates instances of a screen and stack it on top
    /> */}
  </Screen>
);

const TweetDetails = ({ route }) => (
  // useRoute() hook rather than passing {route} prop if component is a child component

  // storing a page into a function
  <Screen>
    {/* {route.params} returns all parameters sent by previous screen */}
    <Text>Tweets Details {route.params.id} </Text>
  </Screen>
);

/////////////////////Stack Navigator///////////////////////////////////////
const Stack = createStackNavigator(); //returns  something similar to a component
const StackNavigator = () => (
  <Stack.Navigator
    // initialRouteName='Tweets' can be used to identify initial page

    screenOptions={{
      // used to define style all screens within stack navigator
      headerStyle: { backgroundColor: "dodgerblue" },
      headerTintColor: "white",
    }}
  >
    <Stack.Screen // 1st screen within navigation
      name='Tweets' // header + identifier
      component={Tweets} // call the function to render page
      options={{
        headerStyle: { backgroundColor: "tomato" }, // header style
        headerTintColor: "white", // header text color
        // headerShown: false, // removes header
      }}
    />
    <Stack.Screen // 2nd screen within navigation
      name='TweetDetails' // header + identifier
      component={TweetDetails} // call the function to render page
      options={
        // dynamically set title based on prev screen parameters
        ({ route }) => ({ title: route.params.id }) // smooth brackets is used to declare that this is an object not just a block of code
      }
    />
  </Stack.Navigator>
);
/////////////////////////////////////////////////////////////////////////////////

const Account = () => (
  // Temp Account Page
  <Screen>
    <Text>Account</Text>
  </Screen>
);

///////////////////////Tab Navigator/////////////////////////////////////////////
const Tab = createBottomTabNavigator();
const TabNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      // set style options for all tabs
      activeBackgroundColor: "tomato", // on tab bg color
      activeTintColor: "white", // on tab text color
      inactiveBackgroundColor: "#eee", //off tab bg color
      inactivateTintColor: "black", // off tab text color
    }}
  >
    <Tab.Screen
      name='Feed'
      component={Tweets}
      options={{
        tabBarIcon: (
          { size, color } // size suggested by react native, color suggested by react native - based on TintColor
        ) => <MaterialCommunityIcons name='home' size={size} color={color} />,
      }}
    />
    <Tab.Screen name='Account' component={Account} />
  </Tab.Navigator>
);
//////////////////////////////////////////////////////////////////////////////////
export default function App() {
  return (
    <NavigationContainer>
      {/* <StackNavigator /> */}
      <TabNavigator />
    </NavigationContainer>
  );
}
