import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  TextInput,
  Button,
} from "react-native";
import * as Yup from "yup";
//BackEnd
import app from "../auth/base.js";
import db from "../api/db";
import AuthApi from "../api/auth";
import axios from "axios";
import { PaymentsStripe as Stripe } from "expo-payments-stripe";
//Front End
import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
  LoadingSubmitButton,
} from "../components/forms";
import AppActivityIndicator from "../components/AppActivityIndicator";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import colors from "../config/colors.js";
import AppText from "../components/AppText.js";

function AddCardDetailScreen(props) {
  useEffect(() => {
    Stripe.setOptionsAsync({
      publishableKey:
        "pk_test_51IcPqUGtUzx3ZmTbhejEutSdJPmxgIYt8MIFJMuub6RSfRaASxU2Db9LwJNUAQdcTTsQCulLk4LU7jw2ca7jplKB00NKDHVNFh", // Your key
    });
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/retrieveCustomer",
      data: {
        cust_id: "cus_JIzbFCVduFeshx", // currentUser.cust_id,
      },
    })
      .then(({ _, data }) => {
        // console.log(data.data[0]);
        console.log(data);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
      });
  }, []);

  const getToken = () => {
    Stripe.paymentRequestWithCardFormAsync()
      .then((data) => {
        console.log("created card token");
        addCardToSource(data.tokenId);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const getCardSources = () => {
    console.log("Getting Card sources");
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/listCardSources",
      data: {
        cust_id: "cus_JIzbFCVduFeshx", // currentUser.cust_id,
      },
    })
      .then(({ _, data }) => {
        // console.log(data.data[0]);
        console.log(data.data);
        if (data.data.length != 0) {
          console.log("hello");
        } else {
          console.log("byebye");
        }
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
      });
  };

  const addCardToSource = (cardToken) => {
    console.log("Adding to source");
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/addCardToSource",
      data: {
        cust_id: "cus_JIzbFCVduFeshx", // currentUser.cust_id,
        cardToken: cardToken,
      },
    })
      .then(({ _, data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
      });
  };

  const deleteCardSource = () => {
    console.log("Deleting card");
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/deleteCardSource",
      data: {
        cust_id: "cus_JIzbFCVduFeshx", // currentUser.cust_id,
        card_id: "card_1IgOYUGtUzx3ZmTbmWZtl9Vk",
      },
    })
      .then(({ _, data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
      });
  };

  const updateDefaultSource = () => {
    console.log("Update default source");
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/setDefaultSource",
      data: {
        cust_id: "cus_JIzbFCVduFeshx", // currentUser.cust_id,
        card_id: "card_1IgPlhGtUzx3ZmTbLOe7kAVT",
      },
    })
      .then(({ _, data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
      });
  };
  return (
    <Screen style={{ backgroundColor: colors.whitegrey }}>
      <ListItemSeperator />
      <View
        style={{
          justifyContent: "center",
          backgroundColor: colors.white,
          marginTop: 10,
        }}
      >
        {/* Header */}
        <View>
          <AppText
            style={{
              color: colors.black,
              fontSize: 20,
              padding: 5,
              fontWeight: "bold",
              marginHorizontal: 5,
            }}
          >
            Card Details
          </AppText>
        </View>
        <ListItemSeperator />
        <Button title='Press' onPress={getToken} />
        <Button title='Get Card Sources' onPress={getCardSources} />
        <Button title='Delete Card Source' onPress={deleteCardSource} />
        <Button
          title='Update Default Card Source'
          onPress={updateDefaultSource}
        />
        {/* Card Number */}
        {/* <CreditCardInput
          autoFocus
          requiresCVC
          labelStyle={styles.label}
          inputStyle={styles.input}
          validColor={"black"}
          invalidColor={"red"}
          placeholderColor={"darkgray"}
          onFocus={onFocus}
          onChange={onChange}
        /> */}

        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 5,
          }}
        >
          <View>
            <AppText
              style={{
                color: colors.muted,
                fontSize: 20,
                padding: 5,
                fontWeight: "bold",
              }}
            >
              Card Number
            </AppText>
          </View>
          <View>
            <TextInput />
          </View>
        </View> */}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

export default AddCardDetailScreen;
