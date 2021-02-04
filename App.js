import React, { useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";

import ViewImageScreen from "./app/screens/ViewImageScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import AppButton from "./app/components/AppButton";
import Card from "./app/components/Card";
import ListingDetailsScreen from "./app/screens/ListingDetailsScreen";
import MessagesScreen from "./app/screens/MessagesScreen";
import Screen from "./app/components/Screen";
import Icon from "./app/components/Icon";
import ListItem from "./app/components/ListItem";
import AccountScreen from "./app/screens/AccountScreen";
import ListingsScreen from "./app/screens/ListingsScreen";
import AppTextInput from "./app/components/AppTextInput";

export default function App() {
  // return <ListingDetailsScreen />;
  // return <WelcomeScreen />;
  // return <ViewImageScreen />;
  // return <MessagesScreen />;
  // return <AccountScreen />;
  // return <ListingsScreen />;
  const [isNew, setIsNew] = useState(false);

  return (
    // <Screen> will make sure every component does not overlap with status bar
    <Screen>
      <Switch // a togglable switch button
        value={isNew}
        onValueChange={(newValue) => setIsNew(newValue)} // On value change, newValue is inputted value, which is sent to setIsNew()
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
