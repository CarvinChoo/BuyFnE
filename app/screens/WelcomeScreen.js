import React from "react";
import { StatusBar } from "expo-status-bar";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

function WelcomeScreen(props) {
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/buyfneLogo.png")}
        />
      </View>
      <View style={styles.loginButton}></View>
      <View style={styles.registerButton}></View>
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
  loginButton: {
    width: "100%",
    height: "10%",
    backgroundColor: "#fc5c65",
  },
  registerButton: {
    width: "100%",
    height: "10%",
    backgroundColor: "#4ecdc4",
  },
  logo: {
    width: 180,
    height: 180,
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: 80,
  },
});
export default WelcomeScreen;
