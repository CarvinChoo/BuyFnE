import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          // Font options : https://github.com/react-native-training/react-native-fonts
          // custom fonts : search for Expo custom fonts
          // fontFamily: "Roboto", // changes font type, each OS has its own list of fonts
          // These properties are only available to <Text> components, will not work on others
          fontSize: 30,
          fontStyle: "italic",
          fontWeight: "700", // font thickness
          color: "tomato",
          textTransform: "capitalize",
          // textDecorationLine: "line-through", // underlines or crosses out text
          textAlign: "center", //align text, "justify" spreads the text so each end of line text touches the side
          lineHeight: 30, // space between lines
        }}
      >
        I love React Native! This is my First React Native app! Here is somemore
        text!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
