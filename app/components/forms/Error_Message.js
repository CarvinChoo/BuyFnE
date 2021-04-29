import React from "react";
import { StyleSheet } from "react-native";
import AppText from "../AppText";

//dynamic Error message component
function Error_Message({ error, visible }) {
  if (!visible || !error) return null; // if visible is false or no error, dont render
  return <AppText style={styles.error}>{error}</AppText>;
}

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
});
export default Error_Message;
