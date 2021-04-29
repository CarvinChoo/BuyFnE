import React from "react";
import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import AppText from "../AppText";

//dynamic Error message component
function Error_Message({ error, visible }) {
  if (!visible || !error) return null; // if visible is false or no error, dont render
  return <AppText style={styles.error}>{error}</AppText>;
}

const styles = StyleSheet.create({
  error: {
    color: colors.red,
    paddingHorizontal: 10,
    fontSize: 15,
  },
});
export default Error_Message;
