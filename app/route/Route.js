import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import AuthApi from "../api/auth";
import navigationTheme from "../navigation/navigationTheme";
import AuthNavigator from "../navigation/AuthNavigator";
import AppNavigator from "../navigation/AppNavigator";

export default Route = ({ children }) => {
  const { currentUser, isLoading } = useContext(AuthApi.AuthContext);
  return (
    <NavigationContainer theme={navigationTheme}>
      {!isLoading && currentUser ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
