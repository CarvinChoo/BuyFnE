import React from "react";
import { Text, StyleSheet, Platform } from "react-native";
// <Heading>My Heading <Heading> can be used apply a heading component to all its children
function AppText({ children }) {
  // custom Component just to apply font properties to its children
  // extracting children properties from props parameter
  return <Text style={styles.text}>{children}</Text>; // encapsulate its children with its properties
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir", // if OS is android, will set text to Roboto style
  },
});
export default AppText;
