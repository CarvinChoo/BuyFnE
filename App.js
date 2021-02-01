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
      <View
        style={{
          backgroundColor: "dodgerblue",
          width: 100,
          height: 100,
          //Borders
          // borderWidth: 10,
          // borderColor: "royalblue",
          // borderRadius: 50, // radius need to be at least 50% of the width and height to be a circle
          // borderTopWidth: 20,
          // borderTopLeftRadius: 50,

          //Shadows
          // Only usable in iOS
          // shadowColor: "grey",
          // shadowOffset: { width: 10, height: 10 },
          // shadowOpacity: 1,
          // shadowRadius:10,

          // Only usable in Android
          //elevation: 20,
        }}
      ></View>
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
