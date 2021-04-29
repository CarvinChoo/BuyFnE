import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../config/colors";

function ListItemSeperator({ style }) {
  return <View style={[styles.seperator, style]} />;
}

const styles = StyleSheet.create({
  seperator: {
    width: "100%",
    height: 2,
    backgroundColor: colors.seperatorgrey,
  },
});

export default ListItemSeperator;
