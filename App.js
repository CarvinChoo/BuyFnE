import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import { Button, View } from "react-native";
import OfflineNotice from "./app/components/OfflineNotice";
// import { AuthProvider } from "./app/api/auth";

export default function App() {
  // const { currentUser } = useContext(AuthContext);
  console.log("Hello");
  return (
    // AuthContext.Provider allows all its children components to have access to the value it passes
    // only passing user will not allow its children to modify the content but by passing setUser as well, it is passing the function to modify the user state
    // <AuthProvider>
    // <NavigationContainer theme={navigationTheme}>
    //   <AuthNavigator />
    // </NavigationContainer>
    // </AuthProvider>
    <NavigationContainer theme={navigationTheme}>
      <AuthNavigator />
    </NavigationContainer>
  );
}
