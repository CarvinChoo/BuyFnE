import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";
import * as firebase from "firebase";
import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
} from "../components/forms";
import useScrollWhenKeyboard from "../hooks/useScrollWhenKeyboard";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

function RegisterScreen() {
  const [error, setError] = useState();
  const [user, setUser] = useState();

  const handleSubmit = async (registration, { resetForm }) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(registration.email, registration.password)
      .then((result) => {
        setError(null);
        //retrieve current user
        const user = firebase.auth().currentUser;

        //used to set additional attributes within a user
        user
          .updateProfile({
            displayName: registration.name,
            photoURL: "https://example.com/jane-q-user/profile.jpg",
          })
          .then(() => {
            console.log(user.displayName);
            setError(null);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  return (
    <ScrollView // make sure to import from react-native, not react-native-gesture-handler
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
            secureTextEntry={true}
            textContentType='password'
          />
          <Error_Message error={error} visible={error} />
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
