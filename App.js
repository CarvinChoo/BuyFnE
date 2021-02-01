import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Import from "@expo/vector-icons" to use icons
import { MaterialCommunityIcons } from "@expo/vector-icons"; // check using https://icons.expo.fyi/ for available icon families

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons // Icon Component
        name='email' // check using https://icons.expo.fyi/ for available icon names
        size={200}
        color='dodgerblue' // uses same color code as react native
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
