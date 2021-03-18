import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function CartButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons name='cart' color={colors.white} size={35} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brightred,
    borderColor: colors.white,
    borderRadius: 40,
    borderWidth: 10,
    width: 80,
    height: 80,
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CartButton;
