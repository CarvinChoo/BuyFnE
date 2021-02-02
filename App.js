import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ViewImageScreen from "./app/screens/ViewImageScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import AppButton from "./app/components/AppButton";

import Card from "./app/components/Card";
export default function App() {
  return (
    <View style={{ backgroundColor: "#f8f4f4", padding: 20, paddingTop: 100 }}>
      <Card
        title='Red Jacket for sale'
        subTitle='$100'
        image={require("./app/assets/jacket.jpg")} ///temporary solution
      />
    </View>
  );
  // return <WelcomeScreen />;
  // return <ViewImageScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
