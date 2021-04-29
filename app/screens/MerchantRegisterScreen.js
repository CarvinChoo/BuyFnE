import React, { useContext, useEffect, useState } from "react";
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
import AuthApi from "../api/auth";
import axios from "axios";
import filestorage from "../api/filestorage";
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
import AppText from "../components/AppText.js";
import colors from "../config/colors.js";

const merchantValidationSchema = Yup.object().shape({
  store_name: Yup.string().required("Store Name is required").label("Name"),
  store_address: Yup.string().required("Store Address is required"),
  store_unitno: Yup.string().required("Store Unit Number is required"),
  postal_code: Yup.string()
    .required("Store Postal Code is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Must be exactly 6 digits")
    .max(6, "Must be exactly 6 digits"),
  bank_account: Yup.string()
    .required("Bank Account Number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(7, "Must be within 7 to 11 digits")
    .max(11, "Must be within 7 to 11 digits"),
  image: Yup.string().min(1, "Please select an image."),
});

function MerchantRegisterScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (currentUser.isMerchant == true) {
      navigation.goBack();
    }
  }, [currentUser]);

  const createExternalAccount = (merchantDetails) => {
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/createBankAccount",
      data: {
        account_holder_name:
          currentUser.first_name + " " + currentUser.last_name,
        stripe_id: currentUser.stripe_id,
        store_address: merchantDetails.store_address,
        store_unitno: merchantDetails.store_unitno,
        postal_code: merchantDetails.postal_code,
        bank_account: merchantDetails.bank_account,
      },
    })
      .then(({ _, data }) => {
        console.log("Succesfully created stripe external account");
        console.log(data);
        uploadImage(data.id, merchantDetails);
      })
      .catch((error) => {
        console.log("Error message: ", error);
        setError(
          "Failed to register as merchant using provided info.\n" +
            error.message
        );
        setLoading(false);
      });
  };

  const uploadImage = async (stripe_bank_id, merchantDetails) => {
    const uri = merchantDetails.image;
    const response = await fetch(uri);

    const blob = await response.blob();

    const ref = filestorage.ref().child(currentUser.uid + "/store_image.jpeg");
    const snapshot = await ref.put(blob);
    // We're done with the blob, close and release it
    blob.close();

    snapshot.ref
      .getDownloadURL()
      .then((url) => {
        console.log("Successfully Uploaded Image.");
        updateUser(stripe_bank_id, merchantDetails, url);
      })
      .catch((error) => {
        console.log("uploadImage:", error.message);
        console.log("Failed to Uploaded Image.");
        setLoading(false);
      });
  };

  const updateUser = (stripe_bank_id, merchantDetails, url = null) => {
    db.collection("users")
      .doc(currentUser.uid)
      .update({
        stripe_bank_id: stripe_bank_id,
        store_name: merchantDetails.store_name,
        store_logo: url,
        isMerchant: true,
        type: 2,
      })
      .then(() => {
        Alert.alert(
          "Welcome BuyFne Merchant",
          "Successfully registered as \n a BuyFnE merchant!"
        );
        console.log("Succesfully updated database with merchant data");
      })
      .catch((error) => {
        console.log("Failed to update database with merchant data.");
        setError(
          "Failed to update database with merchant data. Please contact support."
        );
        setLoading(false);
      });
  };
  // Function to handle submission
  const handleSubmit = (merchantDetails) => {
    setLoading(true);
    createExternalAccount(merchantDetails);
    // console.log(merchantDetails);
    // Alert.alert(
    //   "Welcome BuyFne Merchant",
    //   "Successfully registered as \n a BuyFnE merchant!"
    // );
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
              store_name: "",
              store_address: "",
              store_unitno: "",
              postal_code: "",
              bank_account: "",
              image: null,
            }}
            onSubmit={handleSubmit}
            validationSchema={merchantValidationSchema}
          >
            <View style={{ marginLeft: 5, marginBottom: 10 }}>
              <AppText
                style={{
                  color: colors.muted,
                  fontWeight: "bold",
                  fontFamily: "Roboto",
                }}
              >
                Store Logo
              </AppText>
            </View>
            <AppFormSingleImagePicker name='image' />
            <AppFormField
              autoCorrect={false}
              maxLength={30}
              icon='storefront'
              name='store_name'
              placeholder='Store Name'
            />
            <AppFormField
              autoCorrect={false}
              autoCompleteType='street-address'
              maxLength={40}
              icon='store'
              name='store_address'
              placeholder='Store Address'
              textContentType='streetAddressLine1'
            />
            <AppFormField
              autoCorrect={false}
              autoCapitalize='none'
              icon='store'
              maxLength={7}
              keyboardType='numeric'
              width='50%'
              name='store_unitno'
              placeholder='Store Unit No #'
            />
            <AppFormField
              autoCapitalize='none'
              autoCorrect={false}
              icon='store'
              keyboardType='numeric'
              maxLength={6}
              name='postal_code'
              width='70%'
              placeholder='Store Postal Code'
              textContentType='postalCode'
            />
            <AppFormField
              autoCapitalize='none'
              autoCorrect={false}
              maxLength={11}
              icon='bank'
              keyboardType='numeric'
              name='bank_account'
              placeholder='Bank Account No #'
            />
            <Error_Message error={error} visible={error} />
            <View style={{ marginVertical: 50 }}>
              {!loading ? ( // !!!!!!Still pressable even when loading, May need an alternative
                <SubmitButton title='Register as Merchant' />
              ) : (
                <LoadingSubmitButton title='Register as Merchant' />
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

export default MerchantRegisterScreen;
