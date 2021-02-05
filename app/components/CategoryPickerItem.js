import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import Icon from "./Icon";

function CategoryPickerItem({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon
        backgroundColor={item.backgroundColor}
        name={item.icon}
        IconType={item.IconType}
        size={80}
      />
      <AppText style={styles.label}>{item.label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    alignItems: "center",
    width: "33%",
  },
  label: {
    marginTop: 5,
    textAlign: "center",
  },
});

export default CategoryPickerItem;
