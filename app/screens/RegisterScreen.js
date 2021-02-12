import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
} from "../components/forms";
import useScrollWhenKeyboard from "../hooks/useScrollWhenKeyboard";
import useAuth from "../auth/useAuth";
import usersApi from "../api/users";
import authApi from "../api/auth";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen() {
  //////////// NON FIREBASE REGISTER FUNCTION////////////////////////////
  const auth = useAuth();
  const [error, setError] = useState();

  const handleSubmit = async (userInfo) => {
    // POST request to send user info to server
    const result = await usersApi.register(userInfo);

    //Check if response is ok
    if (!result.ok) {
      if (result.data) setError(result.data.error);
      // if response is not ok but data is properly process but due to maybe existing email, it returns an error
      else {
        // Happens maybe when internet connection is cut off
        setError("An unexpected error occurred.");
        console.log(result);
      }
      return;
    }

    // Procced to login user if registration is successful
    // rename data to alias "authToken"
    const { data: authToken } = await authApi.login(
      userInfo.email,
      userInfo.password
    );
    auth.logIn(authToken); // uses useAuth hook to process login
  };

  /////////////////////////////////////////////////////////////////////////
  return (
    <ScrollView // make sure to import from react-native, not react-native-gesture-handler
    >
      <Screen style={styles.container}>
        <AppForm
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Error_Message error={error} visible={error} />
          <AppFormField
            autoCorrect={false}
            icon='account'
            name='name'
            placeholder='Name'
          />
          <AppFormField
            autoCapitalize='none'
            autoCorrect={false}
            icon='email'
            keyboardType='email-address'
            name='email'
            placeholder='Email'
            textContentType='emailAddress'
          />
          <AppFormField
            autoCapitalize='none'
            autoCorrect={false}
            icon='lock'
            name='password'
            placeholder='Password'
            secureTextEntry
            textContentType='password'
          />
          <SubmitButton title='Register' />
        </AppForm>
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
