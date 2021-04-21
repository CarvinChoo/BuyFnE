import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Yup from "yup"; // use to validation
// Back end
import app from "../auth/base.js";
import AppForm from "../components/forms/AppForm.js";
import AppFormField from "../components/forms/AppFormField.js";
import SubmitButton from "../components/forms/SubmitButton.js";
import Screen from "../components/Screen.js";

const validationSchema = Yup.object().shape({
  // can use Yup.string() or Yup.number(),  used to define the rules to validate
  // Yup.object().shape() lets you define the shape of the input
  email: Yup.string().required().email().label("Email"), // means it needs to be string ,required to be filled, and to be an email
  // .label("Email") ensure it is rendered as "Email" in text
});

function ForgetPasswordScreen({ navigation }) {
  const passwordReset = (form) => {
    app
      .auth()
      .sendPasswordResetEmail(form.email)
      .then(() => {
        alert("A reset password request has been sent to your email.");
        navigation.goBack();
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <Screen>
      <View style={{ alignItems: "center", flex: 1, marginTop: 100 }}>
        <AppForm
          initialValues={{ email: "" }}
          onSubmit={(form) => passwordReset(form, navigation)}
          validationSchema={validationSchema} //setting the schema to follow
        >
          <AppFormField
            name='email'
            autoCapitalize='none'
            autoCorrect={false}
            icon='email'
            keyboardType='email-address'
            placeholder='Email to reset password'
            textContentType='emailAddress'
            width='80%'
          />
          <SubmitButton style={{ width: "80%" }} title='Reset Password' />
        </AppForm>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ForgetPasswordScreen;
