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
import { NavigationContainer, useNavigation } from "@react-navigation/native";

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
    <Link />
    {/* <Button
      title='View Tweet'
      onPress={() => navigation.navigate("Tweets")} // navigates to instance of screen, is already there, no duplication
    /> */}

    {/* <Button
      title='View Tweet'
      onPress={() => navigation.push("Tweets")} // duplicates instances of a screen and stack it on top
    /> */}
  </Screen>
);

const TweetDetails = () => (
  // storing a page into a function
  <Screen>
    <Text>Tweets Details</Text>
  </Screen>
);

const Stack = createStackNavigator(); //returns  something similar to a component
const StackNavigator = () => (
  <Stack.Navigator
  // initialRouteName='Tweets' can be used to identify initial page
  >
    <Stack.Screen // 1st screen within navigation
      name='Tweets' // header + identifier
      component={Tweets} // call the function to render page
    />
    <Stack.Screen // 2nd screen within navigation
      name='TweetDetails' // header + identifier
      component={TweetDetails} // call the function to render page
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
