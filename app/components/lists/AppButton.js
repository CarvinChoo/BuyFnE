import React from "react";
import { StyleSheet, Text, TouchableHighlight } from "react-native";
import colors from "../../config/colors";
function AppButton({ title, onPress, color }) {
  return (
    <TouchableHighlight
      style={[
        styles.button,
        color
          ? { backgroundColor: colors[color] }
          : { backgroundColor: colors.brightred },
      ]} // accessing property in colors using name index e.g.
      onPress={onPress} //if color is "cyan", colors["cyan"] will reference cyan from colors.js
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 5,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
export default AppButton;
