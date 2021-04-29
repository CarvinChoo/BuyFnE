import React, { useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

import colors from "../config/colors";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
function WelcomeScreen({ navigation }) {
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
          title='Login'
          color='brightred'
          onPress={() => navigation.navigate(routes.LoginNav)}
        />
        <AppButton
          title='Register'
          color='cyan'
          onPress={() => navigation.navigate(routes.REGISTER)}
        />
      </View>
      <StatusBar style='auto' />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonscontainer: {
    padding: 20,
    marginTop: 100,
    width: "90%",
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: 40,
  },
});
export default WelcomeScreen;
