import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

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

export default function App() {
  // return <ListingDetailsScreen />;
  // return <WelcomeScreen />;
  // return <ViewImageScreen />;
  // return <MessagesScreen />;
  // return <AccountScreen />;
  // return <ListingsScreen />;
  const [firstName, setFirstName] = useState(""); //state of text
  return (
    <Screen>
      {/* updated as user types something */}
      <Text>{firstName}</Text>
      <TextInput
        // secureTextEntry={true} //hides text like a password
        secureTextEntry //can also just use properties name to auto set to true
        clearButtonMode='always' //only works on iOS, shows a clear all button in text box
        keyboardType='numeric' // sets keyboard used, use alt-space to see types
        maxLength={5} // max length user can type
        onChangeText={(text) => setFirstName(text)} // will activate as user types something into text box, for now it sets the state for firstName
        placeholder='First Name' // default background shown text if nothing is typed.
        style={{
          borderBottomColor: "#ccc", //a bottom border color
          borderBottomWidth: 1, //a bottom border width
        }}
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
