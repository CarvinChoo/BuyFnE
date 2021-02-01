import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// organized but confusing approach
// import AppText from "./app/components/AppText"; // index.js in AppText folder will automatically export whats its referencing to, to this import
import AppText from "./app/components/AppText/AppText"; //straight away importing from referenced AppText file
export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppText>I love React Native!</AppText>
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
