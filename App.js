import React from "react";
import { AsyncStorage } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import { Button, View } from "react-native";

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
  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
      {/* <AuthNavigator/> */}
    </NavigationContainer>
  );
}
