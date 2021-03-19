import React, { useContext } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
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

const validationSchema = Yup.object().shape({
  // can use Yup.string() or Yup.number(),  used to define the rules to validate
  // Yup.object().shape() lets you define the shape of the input
  email: Yup.string().required().email().label("Email"), // means it needs to be string ,required to be filled, and to be an email
  // .label("Email") ensure it is rendered as "Email" in text

  password: Yup.string().required().min(4).label("Password"), //can use ".matches()" to match it with a regular express
});

function LoginScreen({ navigation }) {
  const {
    setCurrentUser,
    loginLoading,
    setLoginLoading,
    setIsLoading,
  } = useContext(AuthApi.AuthContext);
  // function to handle submission
  const handSubmit = (loginDetails) => {
    setIsLoading(true);
    setLoginLoading(true);
    app
      .auth()
      .signInWithEmailAndPassword(loginDetails.email, loginDetails.password)
      .then((userCredential) => {
        // console.log("Login Successful");
        console.log("Correct Credentials");
        authVerification(userCredential.user);
      })
      .catch((error) => {
        alert(
          "Wrong Email/Password! Please sign in using a valid email/password."
        );
        setIsLoading(false);
      });
  };
  const authVerification = (user) => {
    if (user.emailVerified == false) {
      app
        .auth()
        .signOut()
        .then(() => {
          alert("Please verify your account via email first.");
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("login signout error:", error.message);
          setCurrentUser(null);
          setIsLoading(false);
        });
    }
    console.log("Login Successful");
    setIsLoading(false);
  };
  //////////////////////////////////////////////////////////////////////
  return (
    <ScrollView // make sure to import from react-native, not react-native-gesture-handler
    >
      <AppActivityIndicator // loagind screen when processing login authentication
        visible={loginLoading}
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
