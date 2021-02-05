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
  const [imageUri, setImageUri] = useState(); // state for storing image Uri

  //Request Premission to access Media Library///////////////////////////////////
  const requestPression = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable premission to access the library.");
  };

  useEffect(() => {
    requestPression();
  }, []); //empty array means only ask permission once
  //////////////////////////////////////////////////////////////////////////////////
  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync(); // wait for image to be picked

      //if user didnt cancel
      if (!result.cancelled) setImageUri(result.uri); // set state to selected image uri
    } catch (error) {
      console.log("Error reading an image!");
    }
  };

  return (
    <Screen>
      <Button title='Select Image' onPress={selectImage} />
      <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
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
