import React, { useContext, useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Yup from "yup"; // use to validation
//Front End
import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
} from "../components/forms"; // uses index.js to import instead of individual import
import AppActivityIndicator from "../components/AppActivityIndicator";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import colors from "../config/colors";
//Navigation
import routes from "../navigation/routes";
// Back end
import app from "../auth/base.js";
import AuthApi from "../api/auth";
import db from "../api/db";

const validationSchema = Yup.object().shape({
  // can use Yup.string() or Yup.number(),  used to define the rules to validate
  // Yup.object().shape() lets you define the shape of the input
  email: Yup.string().required().email().label("Email"), // means it needs to be string ,required to be filled, and to be an email
  // .label("Email") ensure it is rendered as "Email" in text

  password: Yup.string().required().min(4).label("Password"), //can use ".matches()" to match it with a regular express
});

function LoginScreen({ navigation }) {
  const { currentUser, loggedIn, setLoggedIn } = useContext(
    AuthApi.AuthContext
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigation.popToTop();
    }
  }, [currentUser]);

  // function to handle submission
  const handSubmit = (loginDetails) => {
    console.log(loggedIn);
    setLoading(true);
    app
      .auth()
      .signInWithEmailAndPassword(loginDetails.email, loginDetails.password)
      .then((userCredential) => {
        // console.log("Login Successful");
        console.log("Correct Credentials");
        authVerification(userCredential.user);
      })
      .catch((error) => {
        Alert.alert(
          "Wrong Credentials",
          "Please sign in using a valid email/password."
        );
        setLoading(false);
      });
  };
  const authVerification = (user) => {
    if (user.emailVerified == false) {
      app
        .auth()
        .signOut()
        .then(() => {
          Alert.alert(
            "Unverified Account",
            "Please verify your account via email first."
          );
          setLoading(false);
        })
        .catch((error) => {
          console.log("login signout error:", error.message);
          setLoading(false);
        });
    }
    console.log("Login Successful");
  };
  //////////////////////////////////////////////////////////////////////
  return (
    <ScrollView // make sure to import from react-native, not react-native-gesture-handler
    >
      <AppActivityIndicator // loagind screen when processing login authentication
        visible={loading}
      />
      <Screen style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/BuyFnELogo-2.png")}
        />
        {/* //////////////////ERROR MESSAGE FOR LOGIN FAIL////////////////////////// */}
        {/* <Error_Message
          error='Invalid email and/or password.'
          visible={loginFailed}
        /> */}
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
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate(routes.FORGETPASSWORD)}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: colors.cadetblue,
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Forget Password?
            </Text>
          </View>
        </TouchableWithoutFeedback>
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
