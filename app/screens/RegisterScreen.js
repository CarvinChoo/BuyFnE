import React, { useContext, useState } from "react";
import {
  ScrollView,
  // Switch,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import * as Yup from "yup";
//BackEnd
import app from "../auth/base.js";
import db from "../api/db";
import filestorage from "../api/filestorage";
import AuthApi from "../api/auth";
import axios from "axios";
//Front End
import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
  LoadingSubmitButton,
  AppFormSingleImagePicker,
  AppDatePicker,
} from "../components/forms";
import AppActivityIndicator from "../components/AppActivityIndicator";

// Validation Schema for Buyer
const shopperValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").label("Name"),
  first_name: Yup.string()
    .required("First Name is required")
    .label("First Name"),
  last_name: Yup.string().required("Last Name is required").label("Last Name"),
  dob: Yup.string()
    .required("Date of Birth is required")
    .label("Date of Birth"),
  email: Yup.string().required("Email is required").email().label("Email"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one Special Case Character"
    ),
  image: Yup.string().nullable(),
});
// // Validation Schema for Seller
// const retailerValidationSchema = Yup.object().shape({
//   storename: Yup.string().required().min(2).label("Store Name"),
//   name: Yup.string().required().label("Name"),
//   email: Yup.string().required().email().label("Email"),
//   password: Yup.string()
//     .required()
//     .matches(
//       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
//       "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one Special Case Character"
//     ),
//   image: Yup.string().nullable(),
// });

function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [isEnabled, setIsEnabled] = useState(false);

  // Handles Toggling of Form Switch
  // const toggleSwitch = () => {
  //   setIsEnabled((previousState) => !previousState);
  // };

  // Function to register user in Firbase Authentication
  const createUser = (registrationDetails) => {
    const dob = new Date(JSON.parse(registrationDetails.dob));
    const age = new Date().getFullYear() - dob.getFullYear();

    if (age > 13) {
      setError(null);
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
          setLoading(false);
        });
    } else {
      setError("Must be 13 years old or older to sign up.");
      setLoading(false);
    }
  };
  // Function to Upload Profile Pic into Firebase Storage
  const uploadImage = async (user, registrationDetails) => {
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
        setLoading(false);
      });
  };
  // Function to Update User properties in Firebase Authentication
  const updateUser = (user, registrationDetails, url = null) => {
    user
      .updateProfile({
        displayName: registrationDetails.name,
        photoURL: url,
      })
      .then(() => {
        createStripeAccount(user, registrationDetails, url);
      })
      .catch((error) => {
        console.log("updateUser error:", error.message);
        deleteUser(user);
      });
  };
  // Function to create Stripe account
  const createStripeAccount = (user, registrationDetails, url) => {
    console.log("Creating Stripe Account.");
    const dob = new Date(JSON.parse(registrationDetails.dob));

    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/createStripeAccount",
      data: {
        email: registrationDetails.email,
        first_name: registrationDetails.first_name,
        last_name: registrationDetails.last_name,
        dob_day: dob.getDate(),
        dob_month: dob.getMonth(),
        dob_year: dob.getFullYear(),
      },
    })
      .then(({ _, data }) => {
        createCustomer(user, registrationDetails, data.id, dob, url);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      });
  };

  const createCustomer = (user, registrationDetails, stripe_id, dob, url) => {
    axios({
      method: "POST",
      url: "https://us-central1-buyfne-63905.cloudfunctions.net/createCustomer",
      data: {
        email: registrationDetails.email,
        name:
          registrationDetails.first_name + " " + registrationDetails.last_name,
      },
    })
      .then(({ _, data }) => {
        createUserCollectionDoc(
          user,
          registrationDetails,
          stripe_id,
          data.id,
          dob,
          url
        );
      })
      .catch((error) => {
        console.log("Error : ", error.message);
      });
  };

  // Function to Create new User doc in Firestore
  const createUserCollectionDoc = (
    user,
    registrationDetails,
    stripe_id,
    cus_id,
    dob,
    url = null
  ) => {
    db.collection("users")
      .doc(user.uid)
      .set({
        uid: user.uid,
        stripe_id: stripe_id,
        cus_id: cus_id,
        first_name: registrationDetails.first_name,
        last_name: registrationDetails.last_name,
        dob_day: dob.getDate(),
        dob_month: dob.getMonth(),
        dob_year: dob.getFullYear(),
        displayName: registrationDetails.name,
        email: registrationDetails.email,
        type: 1,
        // type: isEnabled ? 2 : 1, // set type numeric 1 for Buyer and 2 for Seller
        // storename: isEnabled ? registrationDetails.storename : "",
        profilePic: url,
        inGroupBuys: null,
        isMerchant: false,
      })
      .then(() => {
        // setUserType(isEnabled ? 2 : 1); // set userType numeric 1 for Buyer and 2 for Seller
        console.log("User Successfully Created.");
        emailVerification(user, registrationDetails);
      })
      .catch((error) => {
        console.log("createUserCollectionDoc error:", error.message);
        deleteUser(user);
      });
  };

  const emailVerification = (user, registrationDetails) => {
    user
      .sendEmailVerification()
      .then(() => {
        Alert.alert(
          "Successful Registration",
          "Verification Email has been sent."
        );
        signOut(user);
      })
      .catch((error) => {
        console.log("emailVerification error", error.message);
        deleteUser(user);
      });
  };
  // Function to create stripe account for user for later activation if they want to be a seller

  const signOut = (user) => {
    app
      .auth()
      .signOut()
      .then(() => {
        console.log("register signout success");
        navigation.goBack();
      })
      .catch((error) => {
        console.log("signOut error:", error.message);
        deleteUser(user);
      });
  };
  // Functions to handle deletion of user under circumstances of registration error
  const deleteUser = (user) => {
    user
      .delete()
      .then(() => {
        console.log("User deleted.");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        console.log("Deletion Failed.");
        setLoading(false);
      });
  };

  // Function to handle submission
  const handleSubmit = (registrationDetails) => {
    setLoading(true);
    createUser(registrationDetails);
  };
  return (
    <ScrollView // make sure to import from react-native, not react-native-gesture-handler
    >
      <AppActivityIndicator // Loading Screen when processing registration with Firebase
        visible={loading}
      />
      <View>
        <Screen style={styles.container}>
          <AppForm
            initialValues={{
              // storename: "",
              first_name: "",
              last_name: "",
              dob: "",
              name: "",
              email: "",
              password: "",
              images: null,
            }}
            onSubmit={handleSubmit}
            validationSchema={
              // isEnabled ? retailerValidationSchema : shopperValidationSchema
              shopperValidationSchema
            }
          >
            <AppFormSingleImagePicker name='image' />
            {/* {isEnabled && (
              <AppFormField
                autoCapitalize='words'
                autoCorrect={false}
                icon='storefront'
                name='storename'
                placeholder='Store Name'
              />
            )} */}
            <AppFormField
              autoCorrect={false}
              icon='account'
              name='first_name'
              placeholder='First Name'
            />
            <AppFormField
              autoCorrect={false}
              icon='account'
              name='last_name'
              placeholder='Last Name'
            />
            {/* Date of Birth field */}
            <AppDatePicker />
            <AppFormField
              autoCorrect={false}
              icon='account'
              name='name'
              placeholder='Display Name'
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
            <View style={{ marginBottom: 30 }}>
              {!loading ? ( // !!!!!!Still pressable even when loading, May need an alternative
                <SubmitButton title='Register' />
              ) : (
                <LoadingSubmitButton title='Register' />
              )}
            </View>
            {/* <View style={{ flexDirection: "row-reverse" }}>
              <Switch
                trackColor={{ false: "#767577", true: "#FD888C" }}
                thumbColor={isEnabled ? colors.brightred : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              {isEnabled ? (
                <AppText style={styles.sellerFormText}>
                  Retailer Registration
                </AppText>
              ) : (
                <AppText style={styles.buyerFormText}>
                  Shopper Registration
                </AppText>
              )}
            </View> */}
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
  buyerFormText: {
    fontWeight: "bold",
    padding: 5,
    color: "#50D0A5",
    fontSize: 20,
  },
  sellerFormText: {
    fontWeight: "bold",
    padding: 5,
    color: "#4ACBF2",
    fontSize: 20,
  },
});

export default RegisterScreen;
