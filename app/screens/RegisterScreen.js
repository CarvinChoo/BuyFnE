import React, { useRef, useContext, useState } from "react";
import { ScrollView, Switch, StyleSheet, View, Text } from "react-native";
import * as Yup from "yup";

//BackEnd
import app from "../auth/base.js";
import db from "../api/db";
import filestorage from "../api/filestorage";
import AuthApi from "../api/auth";
//Front End
import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
  LoadingSubmitButton,
  AppFormSingleImagePicker,
} from "../components/forms";
import AppActivityIndicator from "../components/AppActivityIndicator";
import colors from "../config/colors.js";

const shopperValidationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  image: Yup.string().nullable(),
});

const retailerValidationSchema = Yup.object().shape({
  storename: Yup.string().required().min(2).label("Store Name"),
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  image: Yup.string().nullable(),
});

function RegisterScreen() {
  const { isLoading, setIsLoading } = useContext(AuthApi.AuthContext);
  const [error, setError] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  // //Function to upload image
  // const uploadImage = async (user, registrationDetails) => {
  //   const imageUri = registrationDetails.image;
  //   let filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);

  //   try {
  //     await filestorage
  //       .ref(user.uid + "/profilePicture/" + filename)
  //       .put(imageUri);

  //     console.log("Successfully Uploaded Image.");
  //   } catch (error) {
  //     console.log(error);
  //     console.log("Failed to Upload Image.");
  //   }
  // };

  // Function to create user
  const createUser = (registrationDetails) => {
    app
      .auth()
      .createUserWithEmailAndPassword(
        registrationDetails.email,
        registrationDetails.password
      )
      .then((result) => {
        setError(null);
        if (registrationDetails.image)
          uploadImage(result.user, registrationDetails);
        else updateUser(result.user, registrationDetails);
      })
      .catch((error) => {
        console.log("createUser error:", error.message);
        setError(error.message);
        deleteUser(result.user);
      });
  };

  const uploadImage = async (user, registrationDetails) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    // const blob = await new Promise((resolve, reject) => {
    //   const xhr = new XMLHttpRequest();
    //   xhr.onload = function () {
    //     resolve(xhr.response);
    //   };
    //   xhr.onerror = function (e) {
    //     console.log(e);
    //     reject(new TypeError("Network request failed"));
    //   };
    //   xhr.responseType = "blob";
    //   xhr.open("GET", uri, true);
    //   xhr.send(null);
    // });
    const uri = registrationDetails.image;
    const response = await fetch(uri);

    const blob = await response.blob();

    const ref = filestorage.ref().child(user.uid + "/profilePicture.jpeg");
    const snapshot = await ref.put(blob);
    // We're done with the blob, close and release it
    blob.close();

    snapshot.ref
      .getDownloadURL()
      .then((url) => {
        console.log("Successfully Uploaded Image.");
        updateUser(user, registrationDetails, url);
      })
      .catch((error) => {
        updateUser(user, registrationDetails);
        console.log("uploadImage:", error.message);
        console.log("Failed to Uploaded Image.");
      });
  };

  const updateUser = (user, registrationDetails, url = null) => {
    user
      .updateProfile({
        displayName: registrationDetails.name,
        photoURL: url,
      })
      .then(() => {
        createUserCollectionDoc(user, registrationDetails);
      })
      .catch((error) => {
        console.log("updateUser error:", error.message);
        deleteUser(user);
      });
  };

  const createUserCollectionDoc = (user, registrationDetails) => {
    db.collection("users")
      .doc(user.uid)
      .set({
        displayName: registrationDetails.name,
        email: registrationDetails.email,
        type: isEnabled ? "Seller" : "Buyer",
        storename: registrationDetails.storename,
      })
      .then(() => {
        console.log("User Successfully Created.");
      })
      .catch((error) => {
        console.log("createUserCollectionDoc error:", error.message);
        deleteUser(user);
      });
  };

  const deleteUser = (user) => {
    user
      .delete()
      .then(() => {
        console.log("User deleted.");
      })
      .catch((error) => {
        console.log(error.message);
        console.log("Deletion Failed.");
      });
  };
  // For Error Implementation later//////////
  // const signOutUser = (user) => {
  //   app
  //     .auth()
  //     .signOut()
  //     .then(() => {
  //       console.log("Sign Out Successful.");
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //       console.log("Sign Out Failed.");
  //     });
  // };

  const handleSubmit = (registrationDetails) => {
    setIsLoading(true);
    createUser(registrationDetails);
    setIsLoading(false);
  };

  return (
    <ScrollView // make sure to import from react-native, not react-native-gesture-handler
    >
      <View>
        <AppActivityIndicator visible={isLoading} />
        <Screen style={styles.container}>
          <AppForm
            initialValues={{
              storename: "",
              name: "",
              email: "",
              password: "",
              images: null,
            }}
            onSubmit={handleSubmit}
            validationSchema={
              isEnabled ? retailerValidationSchema : shopperValidationSchema
            }
          >
            <AppFormSingleImagePicker name='image' />
            {isEnabled && (
              <AppFormField
                autoCapitalize='words'
                autoCorrect={false}
                icon='storefront'
                name='storename'
                placeholder='Store Name'
              />
            )}
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
            <Error_Message error={error} visible={error} />
            {!isLoading ? (
              <SubmitButton title='Register' />
            ) : (
              <LoadingSubmitButton title='Register' />
            )}
            <View style={{ flexDirection: "row-reverse" }}>
              <Switch
                trackColor={{ false: "#767577", true: "#FD888C" }}
                thumbColor={isEnabled ? colors.brightred : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              {isEnabled ? (
                <Text
                  style={{
                    fontWeight: "bold",
                    padding: 5,
                    color: "#4ACBF2",
                    fontSize: 20,
                  }}
                >
                  Retailer Registration
                </Text>
              ) : (
                <Text
                  style={{
                    fontWeight: "bold",
                    padding: 5,
                    color: "#50D0A5",
                    fontSize: 20,
                  }}
                >
                  Shopper Registration
                </Text>
              )}
            </View>
          </AppForm>
        </Screen>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
