import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
function AppButton({ title, onPress, color, icon }) {
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
      <View style={{ flexDirection: "row" }}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={25}
            color={colors.white}
            style={styles.icon}
          />
        )}
        <Text style={styles.text}>{title}</Text>
      </View>
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
  icon: {
    marginRight: 10,
  },
});
export default AppButton;
