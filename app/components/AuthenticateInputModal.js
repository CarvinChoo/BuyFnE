import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-native";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import AppButton from "./AppButton";
import Screen from "./Screen";
import AppTextInput from "./AppTextInput";
import { Error_Message } from "./forms";
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import app from "../auth/base.js";
import * as firebase from "firebase";
import { Alert } from "react-native";
import AppText from "./AppText";
import AppActivityIndicator from "./AppActivityIndicator";
import filestorage from "../api/filestorage";
function AuthenticateInputModal({
  visible,
  profilePic,
  localImage,
  onPress,
  email,
  first_name,
  last_name,
  displayName,
}) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [error, setError] = useState(null);
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setSecret("");
    setError(null);
  }, [visible]);

  const reauthenticate = (secret) => {
    setLoading(true);
    var user = app.auth().currentUser;
    if (secret.length > 0) {
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        secret
      );
      user
        .reauthenticateWithCredential(credential)
        .then(function () {
          setError(null);
          saveChanges();
        })
        .catch(function (error) {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError("Please type a password");
      setLoading(false);
    }
  };

  const saveChanges = () => {
    var user = firebase.auth().currentUser;
    onPress();
    user
      .updateEmail(email)
      .then(function () {
        if (localImage) {
          if (profilePic) {
            uploadImage(profilePic);
          } else {
            updateDatabase(profilePic);
          }
        } else {
          updateDatabase(profilePic);
        }
      })
      .catch(function (error) {
        console.log(error.message);
        Alert.alert(
          "Save Changes Failed",
          "Please try again in a few minutes or contact an administrator"
        );
        setLoading(false);
      });
  };

  const uploadImage = async (profilePic) => {
    const uri = profilePic;
    const response = await fetch(uri);

    const blob = await response.blob();

    const ref = filestorage
      .ref()
      .child(currentUser.uid + "/profilePicture.jpeg");
    const snapshot = await ref.put(blob);
    // We're done with the blob, close and release it
    blob.close();

    snapshot.ref
      .getDownloadURL()
      .then((url) => {
        updateDatabase(url);
        console.log("Successfully Uploaded Image.");
      })
      .catch((error) => {
        updateDatabase(null);
        console.log("uploadImage:", error.message);
        console.log("Failed to Uploaded Image.");
        setLoading(false);
      });
  };

  const updateDatabase = (newprofilePic) => {
    db.collection("users")
      .doc(currentUser.uid)
      .update({
        email: email,
        first_name: first_name,
        last_name: last_name,
        displayName: displayName,
        profilePic: newprofilePic,
      })
      .then(() => {
        Alert.alert(
          "Changes Saved",
          "Changes has been successfully saved and updated. If you have changed your email, you are required to re-verify your email upon next login."
        );
        setLoading(false);
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
            <AppText style={{ fontSize: 15, color: colors.muted }}>
              Retype your password to reauthenticate yourself
            </AppText>
            <AppTextInput
              color={colors.white}
              placeholder='Password'
              onChangeText={(secret) => {
                setSecret(secret);
              }}
              secureTextEntry
            />
            <Error_Message error={error} visible={error} />
            <AppButton
              color={!loading ? "brightred" : "grey"}
              title='Save Changes'
              style={{ width: "50%", padding: 10 }}
              onPress={() => !loading && reauthenticate(secret)}
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

export default AuthenticateInputModal;
