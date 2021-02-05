import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Premissions from "expo-permissions";

import ViewImageScreen from "./app/screens/ViewImageScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import AppButton from "./app/components/lists/AppButton";
import Card from "./app/components/lists/Card";
import ListingDetailsScreen from "./app/screens/ListingDetailsScreen";
import MessagesScreen from "./app/screens/MessagesScreen";
import Screen from "./app/components/lists/Screen";
import Icon from "./app/components/lists/Icon";
import ListItem from "./app/components/lists/ListItem";
import AccountScreen from "./app/screens/AccountScreen";
import ListingsScreen from "./app/screens/ListingsScreen";
import AppTextInput from "./app/components/lists/AppTextInput";
import AppPicker from "./app/components/lists/AppPicker";
import AppText from "./app/components/lists/AppText";
import LoginScreen from "./app/screens/LoginScreen";
import ListingEditScreen from "./app/screens/ListingEditScreen";

export default function App() {
  //return <ListingDetailsScreen />;
  //return <WelcomeScreen />;
  // return <ViewImageScreen />;
  // return <MessagesScreen />;
  //return <AccountScreen />;
  //return <ListingsScreen />;
  //return <ListingEditScreen />;

  //Request Premission to access Media Library
  const requestPression = async () => {
    //Alternative Way to request permission for both camera roll and location, returns same things
    // const result = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.LOCATION);
    // result.granted

    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable premission to access the library.");
  };

  useEffect(() => {
    requestPression();
  }, []); //empty array means only ask permission once

  return <Screen></Screen>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
