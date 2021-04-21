import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import defaultStyles from "../config/styles";
import AppText from "./AppText";

function SquareTextInput({
  containerStyle,
  inputStyle,
  placeholderTitle,
  boxWidth = "65%",
  textAlign = "right",
  ...otherProps
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {placeholderTitle && (
        <View style={{ alignItems: "flex-start" }}>
          <AppText
            style={[
              defaultStyles.text,
              { color: colors.darkgray, fontWeight: "bold" },
            ]}
          >
            {placeholderTitle}
          </AppText>
        </View>
      )}
      <TextInput
        placeholderTextColor={colors.muted}
        textAlign={textAlign}
        style={[
          {
            color: colors.darkgray,
            width: boxWidth,
            fontSize: 15,
          },
          inputStyle,
        ]}
        {...otherProps} // spread all other properties given in argument into this component
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default SquareTextInput;
