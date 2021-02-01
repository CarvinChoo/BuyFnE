import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    //SafeAreaView only works for iOS
    // An array of styles, the right always overwrites the left
    <SafeAreaView style={[styles.container, containerStyle]}>
      <Button title='Click Me' onPress={() => console.log("Button Pressed")} />
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
