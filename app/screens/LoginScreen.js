import React from "react";
import { Image, StyleSheet } from "react-native";
import { Formik } from "formik";

import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import Screen from "../components/Screen";

function LoginScreen(props) {
  //   const [email, setEmail] = useState();  //no longer needed with Formik as it tracks it internally
  //   const [password, setPassword] = useState(); //no longer needed with Formik as it tracks it internally
  return (
    <Screen style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/BuyFnELogo-2.png")}
      />
      <Formik // a form to handle submission
        initialValues={{ email: "", password: "" }} // set the format of what values to track
        onSubmit={(values) => console.log(values)} //future, used to call server and sumbit form
      >
        {/* passes premade 2 functions that handles state changes and handlesubmissions */}
        {({ handleChange, handleSubmit }) => (
          <>
            <AppTextInput // customer TextInput component that uses all the same props
              autoCapitalize='none' //remove auto cap
              autoCorrect={false} // remove auto correct
              icon='email'
              keyboardType='email-address'
              onChangeText={handleChange("email")}
              placeholder='Email'
              textContentType='emailAddress' // only for iOS, autofills from user keychain
            />
            <AppTextInput
              autoCapitalize='none' //remove auto cap
              autoCorrect={false} // remove auto correct
              icon='lock'
              onChangeText={handleChange("password")}
              placeholder='Password'
              textContentType='password' // only for iOS, autofills from user keychain
              secureTextEntry //hide text as they are typed
            />
            <AppButton title='Login' onPress={handleSubmit} />
          </>
        )}
      </Formik>
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
