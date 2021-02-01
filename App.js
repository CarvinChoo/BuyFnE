import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useDimensions,
  useDeviceOrientation,
} from "@react-native-community/hooks";
export default function App() {
  // console.log(useDimensions()); // returns accurate dimensions when rotation happens
  const { landscape } = useDeviceOrientation(); //returns if landscape or portait
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: "dodgerblue",
          width: "100%",
          height: landscape ? "100%" : "30%", // if rotation is in landscape mode, it will set height to 100%
        }}
      ></View>
      <StatusBar style='auto' />
    </SafeAreaView>
  );
}
const containerStyle = { backgroundColor: "orange" };

const styles = StyleSheet.create({
  //allows better tracking of errors in style sheet
  // not css, just javascript properties
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: Platform.OS === "android" ? 20 : 0, // to check the OS, if OS is android it will give 20 padding else 0
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // to check the OS, if OS is android set container to be just below status bar
  },
});
