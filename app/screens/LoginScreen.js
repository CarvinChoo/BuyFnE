import React, { useRef, useEffect, useState, useContext } from "react";
import { Image, Keyboard, ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup"; // use to validation

import Screen from "../components/Screen";

import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
} from "../components/forms"; // uses index.js to import instead of individual import
import useScrollWhenKeyboard from "../hooks/useScrollWhenKeyboard";
import useAuth from "../auth/useAuth";

const validationSchema = Yup.object().shape({
  // can use Yup.string() or Yup.number(),  used to define the rules to validate
  // Yup.object().shape() lets you define the shape of the input
  email: Yup.string().required().email().label("Email"), // means it needs to be string ,required to be filled, and to be an email
  // .label("Email") ensure it is rendered as "Email" in text

  password: Yup.string().required().min(4).label("Password"), //can use ".matches()" to match it with a regular express
});

function LoginScreen(props) {
  // For learning use /////////////////////////////////////////////
  const auth = useAuth(); // retreive context (user and setUser) from App.js

  const [loginFailed, setLoginFailed] = useState(false); //state to determine whether to show login error message or not

  // function to handle submission
  const handSubmit = async ({ email, password }) => {
    const result = await authApi.login(email, password); // request to server to login using these parameters
    if (!result.ok) return setLoginFailed(true);

    setLoginFailed(false);

    // Previous login processes has been moved to useAuth.js
    auth.logIn(result.data); //calls function from useAuth to decode token, set user and store token in cache
  };
  //////////////////////////////////////////////////////////////////////
  return (
    <ScrollView // make sure to import from react-native, not react-native-gesture-handler
    >
      <Screen style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/BuyFnELogo-2.png")}
        />
        {/* //////////////////ERROR MESSAGE FOR LOGIN FAIL////////////////////////// */}
        <Error_Message
          error='Invalid email and/or password.'
          visible={loginFailed}
        />
        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={handSubmit}
          validationSchema={validationSchema} //setting the schema to follow
        >
          <AppFormField
            name='email'
            autoCapitalize='none'
            autoCorrect={false}
            icon='email'
            keyboardType='email-address'
            placeholder='Email'
            textContentType='emailAddress'
          />
          <AppFormField
            name='password'
            autoCapitalize='none'
            autoCorrect={false}
            icon='lock'
            placeholder='Password'
            textContentType='password'
            secureTextEntry
          />

          <SubmitButton title='Login' />
        </AppForm>
      </Screen>
    </ScrollView>
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
