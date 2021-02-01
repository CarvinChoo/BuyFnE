import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "dodgerblue",
          // flexBasis: 100, // if element primay axis is vertical, this can be used to set width , if horizontal, it is used to set height
          // virtually identical to width or height
          //flexGrow: 1, // same as setting flex property but does not require refresh
          // same as
          // flex: 1,
          width: 400,
          // flexShrink: 1, // if there is overflow, this item will resize so other items can fit
          // same as
          flex: -1,
          height: 100,
        }}
      />
      <View
        style={{
          backgroundColor: "gold",
          width: 100,
          height: 100,
        }}
      />
      <View
        style={{
          backgroundColor: "tomato",
          width: 100,
          height: 100,
        }}
      />
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
