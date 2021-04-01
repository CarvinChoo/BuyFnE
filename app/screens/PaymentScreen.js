// import { PaymentScreensStripe as Stripe } from "expo-payments-stripe";
import React from "react";
import { StyleSheet } from "react-native";
import AppButton from "../components/AppButton.js";
import Screen from "../components/Screen.js";
import app from "./app/auth/base";
// initializing Payment module
// useEffect(() => {
//   Stripe.setOptionsAsync({
//     publishableKey:
//       "pk_test_51IaC6WBpR8rInpG52iqhGFYLoJ25g1nDaUw7fxhhSgpIwox3jfb1IzFbCoXMS2UtVVqgzK6ZsyX7Etqs2nVPRt3E00iMY6cfDA", // Your key
//   });
// }, []);

function PaymentScreen(props) {
  const handleClick = () => {
    console.log("Clicked");
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
