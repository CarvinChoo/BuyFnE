import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import AppButton from "./AppButton";
import Screen from "./Screen";
import AppTextInput from "./AppTextInput";
import { Error_Message } from "./forms";
import { Alert } from "react-native";
import AppText from "./AppText";
import AppActivityIndicator from "./AppActivityIndicator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import app from "../auth/base.js";
import * as firebase from "firebase";
import axios from "axios";

function AuthenticateAndDeleteModal({ visible, onPress, navigation }) {
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
          closeBuyerAccount();
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

  const closeBuyerAccount = () => {
    onPress();
    db.collection("transactions")
      .where("buyer_id", "==", currentUser.uid)
      .where("status", "==", 3)
      .get()
      .then((trans) => {
        var promises = [];
        if (!trans.empty) {
          trans.forEach((tran) => {
            var refundDeadline = tran.data().orderDate.toDate();
            refundDeadline.setHours(refundDeadline.getHours() + 3);
            if (new Date() < refundDeadline) {
              promises.push(
                tran.ref
                  .update({
                    status: 6,
                  })
                  .then(() => {
                    axios({
                      // issueing refund using cloud functiosn to communicate with stripe api
                      method: "POST",
                      url: "https://us-central1-buyfne-63905.cloudfunctions.net/createRefund",
                      data: {
                        charge_id: tran.data().charge_id,
                      },
                    })
                      .then(({ _, data }) => {
                        console.log("Refunded");
                      })
                      .catch((error) => {
                        console.log("Error : ", error.message);
                      });
                  })
                  .catch((err) => {
                    console.log("Error: ", err.message);
                  })
              );
            }
          });
        } else {
          console.log("Nothing to refund");
        }

        Promise.all(promises)
          .then(() => {
            //delete support tickets
            deleteSupportTickets();
          })
          .catch((e) => {
            console.log(e.message);
            Alert.alert("Failed to close account", e.message);
          });
      })
      .catch((e) => {
        console.log(e.message);
        Alert.alert("Failed to close account", e.message);
      });
  };

  //delete support tickets
  const deleteSupportTickets = () => {
    db.collection("supportTickets")
      .where("user_uid", "==", currentUser.uid)
      .get()
      .then((tickets) => {
        var promises2 = [];
        if (!tickets.empty) {
          tickets.forEach((ticket) => {
            promises2.push(
              ticket.ref
                .delete()
                .then(() => console.log("Ticket deleted"))
                .catch((e) => console.log(e.message))
            );
          });
        } else {
          console.log("There is no support ticket to delete.");
        }

        // delete user chat
        Promise.all(promises2)
          .then(() => {
            deleteChat();
          })
          .catch((e) => {
            console.log(e.message);
            Alert.alert("Failed to close account", e.message);
          });
      })
      .catch((e) => {
        console.log(e.message);
        Alert.alert("Failed to close account", e.message);
      });
  };

  //Delete user chat
  const deleteChat = () => {
    db.collection("chat")
      .where("user_uid", "==", currentUser.uid)
      .get()
      .then((chats) => {
        var promises3 = [];
        if (!chats.empty) {
          chats.forEach((chat) => {
            promises3.push(
              chat.ref
                .delete()
                .then(() => console.log("chat deleted"))
                .catch((e) => console.log(e.message))
            );
          });
        } else {
          console.log("There is no chat to delete.");
        }
        // delete user from database
        Promise.all(promises3)
          .then(() => {
            deleteUserDatabase();
          })
          .catch((e) => {
            console.log(e.message);
            Alert.alert("Failed to close account", e.message);
          });
      })
      .catch((e) => {
        console.log(e.message);
        Alert.alert("Failed to close account", e.message);
      });
  };

  // delete user from database
  const deleteUserDatabase = () => {
    db.collection("users")
      .doc(currentUser.uid)
      .delete()
      .then(() => {
        console.log("User in database deleted");
        //Delete user from auth
        deleteUserAuth();
      })
      .catch((e) => {
        console.log(e.message);
        Alert.alert("Failed to close account", e.message);
      });
  };

  //Delete user from auth
  const deleteUserAuth = () => {
    var user = app.auth().currentUser;
    user
      .delete()
      .then(() => {
        console.log("User in firebase auth deleted");
        app.auth().signOut();
        Alert.alert("Account Closed", "Your BuyFnE account has been closed.");
        navigation.goBack();
      })
      .catch((e) => {
        console.log(e.message);
        Alert.alert("Failed to close account", e.message);
      });
  };

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Modal visible={visible}>
        <Screen style={{ backgroundColor: colors.whitegrey, paddingTop: 0 }}>
          <View style={{ alignItems: "flex-end", marginTop: 10 }}>
            <TouchableOpacity onPress={onPress}>
              <MaterialCommunityIcons size={35} name='close' />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <AppText
              style={{ fontSize: 13, color: colors.brown, marginBottom: 5 }}
            >
              Warning! Closing your account will result in losing track of your
              orders' status and will automatically issue refunds on all order
              that are eligible.
            </AppText>
            <AppText
              style={{ fontSize: 13, color: colors.brown, marginBottom: 10 }}
            >
              BuyFnE is not liable for any shipments that do not arrive upon the
              closure of your BuyFnE account.
            </AppText>
            <AppText style={{ fontSize: 15, color: colors.muted }}>
              Type your password to proceed with the closure of your BuyFnE
              account
            </AppText>
            <AppTextInput
              color={colors.white}
              autoCapitalize='none'
              placeholder='Password'
              onChangeText={(secret) => {
                setSecret(secret);
              }}
              secureTextEntry
            />
            <Error_Message error={error} visible={error} />
            <AppButton
              color={!loading ? "brightred" : "grey"}
              title='Proceed to Close Account'
              style={{ width: "90%", padding: 10 }}
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

export default AuthenticateAndDeleteModal;
