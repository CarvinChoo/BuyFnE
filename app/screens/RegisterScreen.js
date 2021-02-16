import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";

import app from "../auth/base.js";
import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
} from "../components/forms";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen() {
  const handleSubmit = async (registrationDetails) => {
    try {
      await app
        .auth()
        .createUserWithEmailAndPassword(
          registrationDetails.email,
          registrationDetails.password
        )
        .then((user) => {
          console.log("still can do stuff");
        });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <ScrollView // make sure to import from react-native, not react-native-gesture-handler
    >
      <AppActivityIndicator visible={false} />
      <Screen style={styles.container}>
        <AppForm
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Error_Message error={""} visible={false} />
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
