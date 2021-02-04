import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import Screen from "../components/Screen";

function LoginScreen(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  return (
    <Screen style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/BuyFnELogo-2.png")}
      />
      <AppTextInput // customer TextInput component that uses all the same props
        autoCapitalize='none' //remove auto cap
        autoCorrect={false} // remove auto correct
        icon='email'
        keyboardType='email-address'
        onChangeText={(text) => setEmail(text)}
        placeholder='Email'
        textContentType='emailAddress' // only for iOS, autofills from user keychain
      />
      <AppTextInput
        autoCapitalize='none' //remove auto cap
        autoCorrect={false} // remove auto correct
        icon='lock'
        onChangeText={(text) => setPassword(text)}
        placeholder='Password'
        textContentType='password' // only for iOS, autofills from user keychain
        secureTextEntry //hide text as they are typed
      />
      <AppButton title='Login' onPress={() => console.log(email, password)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center", //overwrite alignment set in Screen
    marginTop: 50,
    marginBottom: 20,
  },
});

export default LoginScreen;
