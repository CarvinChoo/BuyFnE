import React from "react";
import { StyleSheet } from "react-native";
import AppText from "./AppText";

//dynamic Error message component
function Error_Message({ error }) {
  if (!error) return null;

  return <AppText style={styles.error}>{error}</AppText>;
}

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
});
export default Error_Message;
