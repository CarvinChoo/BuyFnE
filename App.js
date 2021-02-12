import React, { useEffect, useState } from "react";
import { AsyncStorage } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import AppLoading from "expo-app-loading";

import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import { Button, View } from "react-native";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";

export default function App() {
  // const demo = async () => {
  //   try {
  //     await AsyncStorage.setItem("person", JSON.stringify({ id: 1 })); //returns a promise, it is an object that returns a state and result.
  //     //Either resolve with result, pending with undefined or rejected with error
  //     const value = await AsyncStorage.getItem("person"); //returns a string
  //     const person = JSON.parse(value); // string need to be parsed to return an object

  //     console.log(person);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // demo(); // calling the async function
  // return null;
  // NetInfo.fetch().then((netInfo) => console.log(netInfo)); // only get network connection info once
  // componentDidMount   // class components need to manually subsribe and unsubscribe or it will cause memory leaks
  // const unsubscribe = NetInfo.addEventListener((netInfo) => console.log(netInfo));
  // //componentWillUnmount
  // unsubscribe();
  // // function component method
  // const netInfo = useNetInfo(); // hook that does subscribing and unsubscribing under the hood
  // // return netInfo.isInternetReachable ? <View>1</View> : <View>2</View>;
  // return <Button disabled={!netInfo.isInternetReachable} title='Hello' />; // disables the button when there is no internet connection
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState();

  const restoreUser = async () => {
    const user = await authStorage.getUser(); // retrieve any user token from cache
    if (user) setUser(user);
  };
  // outdate method due to loading screen implementation
  // // This makes sure the call for exisitng token in cache is only called once
  // useEffect(() => {
  //   restoreToken(); // new function is restoreUser()
  // }, []);

  // see if state of the app is ready after performing initial functions
  if (!isReady)
    return (
      // displays a screen that prevents WelcomeScreen from appearing when App is loading
      <AppLoading
        startAsync={restoreUser} // sets what functions should be called when apps starts
        onFinish={() => setIsReady(true)} //when functions set in startAsync is finished, it will set state to ready
        onError={console.log("Error")}
      />
    );

  return (
    // AuthContext.Provider allows all its children components to have access to the value it passes
    // only passing user will not allow its children to modify the content but by passing setUser as well, it is passing the function to modify the user state
    <AuthContext.Provider value={{ user, setUser }}>
      <OfflineNotice />
      <NavigationContainer theme={navigationTheme}>
        {/* renders AppNavigator (ListingsScreen) if user already set else renders AuthNavigator (Welcome Screen) */}
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
