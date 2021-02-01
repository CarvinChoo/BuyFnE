import React from "react";
import { Text } from "react-native";
import styles from "./styles";
// <Heading>My Heading <Heading> can be used apply a heading component to all its children
function AppText({ children }) {
  // custom Component just to apply font properties to its children
  // extracting children properties from props parameter
  return <Text style={styles.text}>{children}</Text>; // encapsulate its children with its properties
}

export default AppText;
