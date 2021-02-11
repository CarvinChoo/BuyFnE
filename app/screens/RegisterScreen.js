import React, { useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";
import * as firebase from "firebase";
import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import useScrollWhenKeyboard from "../hooks/useScrollWhenKeyboard";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

const handleSubmit = (registration, { resetForm }) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(registration.email, registration.password)
    .then((result) => {
      console.log(result);
      resetForm();
    })
    .catch((error) => {
      console.log("error", error);
      resetForm();
    });
};

function RegisterScreen() {
  const scrollView = useRef(); // looks for current instance to reference

  //passes current instance into hook
  useScrollWhenKeyboard(scrollView); //Custom Hook for Scroll up when Keyboard covers Text Input

  return (
    <ScrollView // make sure to import from react-native, not react-native-gesture-handler
      ref={scrollView}
    >
      <Screen style={styles.container}>
        <AppForm
          initialValues={{
            name: "",
            email: "",
            password: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
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
