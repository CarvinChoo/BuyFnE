import React from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import defaultStyles from "../config/styles";

function AppTextInput({ icon, ...otherProps }) {
  //"...otherProps" copies all other properties given in the argument that isn't specified before
  // Text box Bar with conditional icon and dynamic text rendering
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={25}
          color={colors.muted}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholderTextColor={colors.muted}
        style={defaultStyles.text}
        {...otherProps} // spread all other properties given in argument into this component
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whitegrey,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
});

export default AppTextInput;
