import React from "react";
import { Text, StyleSheet, Platform } from "react-native";
import colors from "../config/colors";

// <Heading>My Heading <Heading> can be used apply a heading component to all its children
function AppText({ children, style }) {
  // custom Component just to apply font properties to its children
  // extracting children properties from props parameter
  return <Text style={[styles.text, style]}>{children}</Text>; // encapsulate its children with its properties
}

const styles = StyleSheet.create({
  text: {
    ...Platform.select({
      // "..." spreads the properties of the object returned by Platform.select into the "text" object
      // returns on of the objects inside it e.g. ios or android, depending on the platform
      textStyle: "italic",
      ios: {
        fontSize: 20,
        fontFamily: "Avenir",
        color: colors.black,
      },
      android: {
        fontSize: 18,
        fontFamily: "Roboto",
        color: colors.black,
      },
    }),
  },
});
export default AppText;
