import React from "react";
import { StatusBar } from "expo-status-bar";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

import colors from "../config/colors";
import AppButton from "../components/lists/AppButton";

function WelcomeScreen(props) {
  return (
    <ImageBackground
      // blurRadius={2}
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/buyfneLogo.png")}
        />
      </View>
      <View style={styles.buttonscontainer}>
        <AppButton
          title='Guest'
          color='darkorange'
          onPress={() => alert("Guest Tapped")}
        />
        <AppButton
          title='Login'
          color='brightred'
          onPress={() => alert("Login Tapped")}
        />
        <AppButton
          title='Register'
          color='cyan'
          onPress={() => alert("Register Tapped")}
        />
      </View>
      <StatusBar style='auto' />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonscontainer: {
    padding: 20,
    width: "90%",
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: 80,
  },
});
export default WelcomeScreen;
