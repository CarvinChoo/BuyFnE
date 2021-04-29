import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import AuthApi from "../api/auth";
import navigationTheme from "../navigation/navigationTheme";
import AuthNavigator from "../navigation/AuthNavigator";
import AppNavigator from "../navigation/AppNavigator";
import AppLoading from "expo-app-loading";

export default Route = ({ children }) => {
  const { initialLoading, userType } = useContext(AuthApi.AuthContext);
  if (initialLoading) {
    return <AppLoading />;
  }
  return (
    <NavigationContainer theme={navigationTheme}>
      <AuthNavigator userType={userType} />
    </NavigationContainer>
  );
};
