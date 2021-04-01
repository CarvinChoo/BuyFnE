// import { PaymentScreensStripe as Stripe } from "expo-payments-stripe";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import AppButton from "../components/AppButton.js";
import Screen from "../components/Screen.js";
import functions from "../api/functions";

// initializing Payment module
// useEffect(() => {
//   Stripe.setOptionsAsync({
//     publishableKey:
//       "pk_test_51IaC6WBpR8rInpG52iqhGFYLoJ25g1nDaUw7fxhhSgpIwox3jfb1IzFbCoXMS2UtVVqgzK6ZsyX7Etqs2nVPRt3E00iMY6cfDA", // Your key
//   });
// }, []);

function PaymentScreen(props) {
  const handleClick = () => {
    const messageText = "Hello, World!";

    var addMessage = functions.httpsCallable("addMessage");
    addMessage({ text: messageText }).then((result) => {
      // Read result of the Cloud Function.
      console.log(result.data);
    });
  };
  return (
    <Screen>
      <AppButton title='Checkout' onPress={handleClick} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default PaymentScreen;
