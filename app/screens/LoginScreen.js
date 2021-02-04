import React from "react";
import { Image, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup"; // use to validation

import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import Error_Message from "../components/Error_Message";

const validationSchema = Yup.object().shape({
  // can use Yup.string() or Yup.number(),  used to define the rules to validate
  // Yup.object().shape() lets you define the shape of the input
  email: Yup.string().required().email().label("Email"), // means it needs to be string ,required to be filled, and to be an email
  // .label("Email") ensure it is rendered as "Email" in text

  password: Yup.string().required().min(4).label("Password"), //can use ".matches()" to match it with a regular express
});

function LoginScreen(props) {
  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView behavior='position'>
        <Image
          style={styles.logo}
          source={require("../assets/BuyFnELogo-2.png")}
        />
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => console.log(values)}
          validationSchema={validationSchema} //setting the schema to follow
        >
          {/* errors contains all the errors the form has encountered */}
          {({ handleChange, handleSubmit, errors }) => (
            <>
              <AppTextInput
                autoCapitalize='none'
                autoCorrect={false}
                icon='email'
                keyboardType='email-address'
                onChangeText={handleChange("email")}
                placeholder='Email'
                textContentType='emailAddress'
              />
              <Error_Message error={errors.email} />
              <AppTextInput
                autoCapitalize='none' //remove auto cap
                autoCorrect={false} // remove auto correct
                icon='lock'
                onChangeText={handleChange("password")}
                placeholder='Password'
                textContentType='password' // only for iOS, autofills from user keychain
                secureTextEntry //hide text as they are typed
              />
              <Error_Message error={errors.password} />
              <AppButton title='Login' onPress={handleSubmit} />
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
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
