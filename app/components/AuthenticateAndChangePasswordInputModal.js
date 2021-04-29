import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-native";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import AppButton from "./AppButton";
import Screen from "./Screen";
import AppTextInput from "./AppTextInput";
import { Error_Message } from "./forms";
// Back End
import app from "../auth/base.js";
import * as firebase from "firebase";
import { Alert } from "react-native";
import AppActivityIndicator from "./AppActivityIndicator";

function AuthenticateAndChangePasswordInputModal({ visible, onPress }) {
  const [error, setError] = useState(null);
  const [secret, setSecret] = useState("");
  const [newSecret, setNewSecret] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setSecret("");
    setNewSecret("");
    setError(null);
  }, [visible]);

  const reauthenticate = (secret) => {
    setLoading(true);
    console.log(validateSecret(newSecret));
    if (validateSecret(newSecret)) {
      var user = app.auth().currentUser;
      if (secret.length > 0) {
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          secret
        );
        user
          .reauthenticateWithCredential(credential)
          .then(function () {
            changeSecret();
          })
          .catch(function (error) {
            console.log(error.message);
            setError("Old Password is invalid.");
            setLoading(false);
          });
      } else {
        setError("Please type your old new password");
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError(
        "New password must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one Special Case Character"
      );
    }
  };
  const validateSecret = (newSecret) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(newSecret);
  };
  const changeSecret = () => {
    var user = firebase.auth().currentUser;
    onPress();
    user
      .updatePassword(newSecret)
      .then(function () {
        Alert.alert(
          "Password Changed",
          "Password has been successfully changed and updated."
        );
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error.message);
        Alert.alert(
          "Password Change Failed",
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
              placeholder='Old Password'
              onChangeText={(secret) => {
                setSecret(secret);
              }}
              secureTextEntry
            />

            <AppTextInput
              color={colors.white}
              placeholder='New Password'
              onChangeText={(secret) => {
                setNewSecret(secret);
              }}
              secureTextEntry
            />
            <Error_Message error={error} visible={error} />
            <AppButton
              title='Change Password'
              style={{ width: "60%", padding: 10 }}
              onPress={() => reauthenticate(secret)}
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

export default AuthenticateAndChangePasswordInputModal;
