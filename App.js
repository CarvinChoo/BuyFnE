import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as firebase from "firebase";

import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";

import ListingEditScreen from "./app/screens/ListingEditScreen";
import RegisterScreen from "./app/screens/RegisterScreen";

const firebaseConfig = {
  apiKey: "AIzaSyAcfTsJmxSR0lDASj3yQWczy8bsyXO7zck",
  authDomain: "buyfne-63905.firebaseapp.com",
  databaseURL: "https://buyfne-63905-default-rtdb.firebaseio.com",
  projectId: "buyfne-63905",
  storageBucket: "buyfne-63905.appspot.com",
  messagingSenderId: "952579479635",
  appId: "1:952579479635:web:49f17fdabe8f087971cea6",
  measurementId: "G-EKLVXTNHWM",
};

// initalize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  return (
    // <RegisterScreen />
    <NavigationContainer theme={navigationTheme}>
      {/* <AppNavigator /> */}
      <AuthNavigator />
    </NavigationContainer>
  );
}
