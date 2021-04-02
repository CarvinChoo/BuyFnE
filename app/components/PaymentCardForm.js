import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CardButton from "./CardButton";

function PaymentCardForm(props) {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {},
});

export default PaymentCardForm;
