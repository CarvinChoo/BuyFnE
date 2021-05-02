import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-native";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import AppButton from "./AppButton";
import Screen from "./Screen";
import AppTextInput from "./AppTextInput";
import { Error_Message } from "./forms";
import { Alert } from "react-native";
import AppActivityIndicator from "./AppActivityIndicator";
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import axios from "axios";

function BankAccountInputModal({ visible, bank_id, onPress, onExit }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [error, setError] = useState(null);
  const [bank_account, setBank_account] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (visible == true) {
      setBank_account("");
      setError(null);
    }
  }, [visible]);

  const validateAccount = (bank_account) => {
    const re = /^[0-9]{7,11}$/;
    return re.test(bank_account);
  };

  const saveChanges = () => {
    setLoading(true);
    if (validateAccount(bank_account)) {
      setError(null);
      createExternalAccount();
    } else {
      setError("New Bank Account No. must be within 7 to 11 digits");
      setLoading(false);
    }
  };

  const createExternalAccount = () => {
    onPress();
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/createNewExternal",
      data: {
        stripe_id: currentUser.stripe_id,
        account_holder_name:
          currentUser.first_name + " " + currentUser.last_name,
        bank_account: bank_account,
      },
    })
      .then(({ _, data }) => {
        deleteExternalAccount(data.last4, data.id);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(
          "Failed to update bank account using information provided",
          error.message
        );
      });
  };

  const deleteExternalAccount = (last4, new_bank_id) => {
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/deleteOldExternal",
      data: {
        stripe_id: currentUser.stripe_id,
        old_bank_id: bank_id,
      },
    })
      .then(({ _, data }) => {
        // console.log(data);
        updateDatabase(last4, new_bank_id);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Failed to update bank account", error.message);
      });
  };

  const updateDatabase = (last4, new_bank_id) => {
    db.collection("users")
      .doc(currentUser.uid)
      .update({
        stripe_bank_id: new_bank_id,
      })
      .then(() => {
        Alert.alert(
          "Changes Saved",
          "Changes has been successfully saved and updated."
        );
        setLoading(false);
        console.log(last4);
        onExit(last4, new_bank_id);
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert(
          "Save Changes Failed",
          "Please try again in a few minutes or contact an administrator"
        );
        setLoading(false);
      });
  };

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Modal visible={visible}>
        <Screen style={{ backgroundColor: colors.whitegrey, paddingTop: 0 }}>
          <Button title='close' onPress={onPress} />
          <View
            style={{
              paddingHorizontal: 30,
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <AppTextInput
              color={colors.white}
              placeholder='New Bank Account no.'
              onChangeText={(secret) => {
                setBank_account(secret);
              }}
              secureTextEntry
            />
            <Error_Message error={error} visible={error} />
            <AppButton
              color={!loading ? "brightred" : "grey"}
              title='Save Changes'
              style={{ width: "50%", padding: 10 }}
              onPress={() => saveChanges()}
            />
          </View>
        </Screen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default BankAccountInputModal;
