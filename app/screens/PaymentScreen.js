import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton.js";
import Screen from "../components/Screen.js";
import functions from "../api/functions";
import { PaymentsStripe as Stripe } from "expo-payments-stripe";
import axios from "axios";
// initializing Payment module

// function PaymentScreen(props) {
//   const handleClick = () => {
//     const messageText = "Hello, World!";

//     var addMessage = functions.httpsCallable("addMessage");
//     addMessage({ text: messageText }).then((result) => {
//       // Read result of the Cloud Function.
//       console.log(result.data);
//     });
//   };
//   return (
//     <Screen>
//       <AppButton title='Checkout' onPress={handleClick} />
//     </Screen>
//   );
// }

function PaymentScreen(props) {
  useEffect(() => {
    Stripe.setOptionsAsync({
      publishableKey:
        "pk_test_51IcPqUGtUzx3ZmTbhejEutSdJPmxgIYt8MIFJMuub6RSfRaASxU2Db9LwJNUAQdcTTsQCulLk4LU7jw2ca7jplKB00NKDHVNFh", // Your key
    });
  }, []);

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const params = {
    // mandatory
    number: "4242424242424242",
    expMonth: 11, //!!! must be future date
    expYear: 23, //!!! must be future year
    cvc: "223",
    // optional
    name: "Test User",
    currency: "usd",
    addressLine1: "123 Test Street",
    addressLine2: "Apt. 5",
    addressCity: "Test City",
    addressState: "Test State",
    addressCountry: "Test Country",
    addressZip: "55555",
  };

  const handleCardPayPress = () => {
    // const token = await Stripe.paymentRequestWithCardFormAsync(options);
    setLoading(true);
    Stripe.createTokenWithCardAsync(params) // !!!!params card expiry date must be future date or application will crash
      .then((newtoken) => {
        console.log(newtoken);
        setToken(newtoken);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        setLoading(false);
      });
  };

  const makePayment = () => {
    setLoading(true);
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/completePaymentWithStripe",
      data: {
        amount: 10000, // amount = 1000 = SG$10
        currency: "sgd",
        // token: token.tokenId,
        token: "tok_bypassPending",
      },
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        setLoading(false);
      });
  };

  const createAccount = () => {
    setLoading(true);
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/createStripeAccount",
      data: {
        country: "SG",
      },
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        setLoading(false);
      });
  };

  const addBankAccount = () => {
    setLoading(true);
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/createBankAccount",
      data: {
        country: "SG",
      },
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        setLoading(false);
      });
  };

  const releasePaymentToSeller = () => {
    setLoading(true);
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/releasePaymentToSeller",
      data: {
        sellerAccountId: "acct_1IcQUN2cfMQkBftI",
      },
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        setLoading(false);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Card Form Example</Text>
      <Text style={styles.instruction}>
        Click button to show Card Form dialog.
      </Text>
      {!loading ? (
        <Button
          title='Enter you card and pay'
          onPress={releasePaymentToSeller}
        />
      ) : (
        <Button title='Enter you card and pay' color='#841584' />
      )}
      <View style={styles.token}>
        {token && (
          <>
            <Text style={styles.instruction}>Token: {token.tokenId}</Text>
            <Button
              title='Make Payment'
              loading={loading}
              onPress={makePayment}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instruction: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
  field: {
    width: 300,
    color: "#449aeb",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
});

export default PaymentScreen;
