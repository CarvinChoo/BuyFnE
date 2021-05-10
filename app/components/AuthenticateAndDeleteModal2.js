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

function AuthenticateAndDeleteModal2({ visible, onPress, navigation }) {
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
          closeMerchantAccount();
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

  const closeMerchantAccount = () => {
    onPress();
    //refund to user
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
                      url:
                        "https://us-central1-buyfne-63905.cloudfunctions.net/createRefund",
                      data: {
                        charge_id: tran.data().charge_id,
                      },
                    })
                      .then(({ _, data }) => {
                        console.log("Refunded to me");
                      })
                      .catch((error) => {
                        console.log("Error : ", error.message);
                      });
                  })
                  .catch((error) => {
                    console.log("Error: ", error.message);
                  })
              );
            }
          });
        } else {
          console.log("Nothing to refund");
        }
        //refund customers
        Promise.all(promises)
          .then(() => {
            refundCustomer();
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

  //Refund Customer
  const refundCustomer = () => {
    db.collection("transactions")
      .where("seller_id", "==", currentUser.uid)
      .orderBy("status", "asc")
      .where("status", "<", 4)
      .get()
      .then((trans) => {
        var promises2 = [];
        if (!trans.empty) {
          trans.forEach((tran) => {
            promises2.push(
              tran.ref
                .update({
                  status: 6, //refunded
                })
                .then(() => {
                  stripe.refunds //refund on failed group buy
                    .create({
                      charge: tran.data().charge_id,
                    })
                    .then(() => {
                      console.log("Refunded to customer");
                    })
                    .catch((error) => {
                      console.log("Error : ", error.message);
                    });
                })
                .catch((error) => {
                  console.log("Error : ", error.message);
                })
            );
          });
        } else {
          console.log("There is nothing to refund to customer");
        }

        //Delete all listings
        Promise.all(promises2)
          .then(() => {
            deleteListings();
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

  //delete listings
  const deleteListings = () => {
    db.collection("all_listings")
      .where("seller", "==", currentUser.uid)
      .get()
      .then((listings) => {
        var promises3 = [];
        if (!listings.empty) {
          listings.forEach((listing) => {
            promises3.push(
              listing.ref
                .delete()
                .then(() => console.log("Listing deleted"))
                .catch((error) => console.log("Error : ", error.message))
            );
          });
        } else {
          console.log("There is no listings to delete");
        }
        // delete support tickets
        Promise.all(promises3)
          .then(() => {
            deleteSupportTickets();
          })
          .catch((e) => {
            console.log(e.message);
            Alert.alert("Failed to close account", e.message);
          });
      });
  };

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
        // delete merchant chat
        Promise.all(promises3)
          .then(() => {
            deleteMerchantChat();
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

  // Delete merchant chat
  const deleteMerchantChat = () => {
    db.collection("chat")
      .where("seller", "==", currentUser.uid)
      .get()
      .then((chats) => {
        var promises3 = [];
        if (!chats.empty) {
          chats.forEach((chat) => {
            promises3.push(
              chat.ref
                .delete()
                .then(() => console.log("merchant chat deleted"))
                .catch((e) => console.log(e.message))
            );
          });
        } else {
          console.log("There is no merchant chat to delete.");
        }

        Promise.all(promises3)
          .then(() => {
            deleteStoreVouchers();
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

  //Delete store vouchers
  const deleteStoreVouchers = () => {
    db.collection("vouchers")
      .where("seller_id", "==", currentUser.uid)
      .get()
      .then((vouchers) => {
        var promises = [];
        if (!vouchers.empty) {
          vouchers.forEach((voucher) => {
            promises.push(
              voucher.ref
                .delete()
                .then(() => {
                  console.log("deleted voucher");
                })
                .catch((e) => {
                  console.log(e.message);
                })
            );
          });
        } else {
          console.log("no vouchers to delete");
        }
        //delete user from database
        Promise.all(promises)
          .then(() => {
            deleteUserDatabase();
          })
          .catch((e) => {
            console.log(e.message);
            Alert.alert("Failed to close account", e.message);
          });
      });
  };
  //delete user from database
  const deleteUserDatabase = () => {
    db.collection("users")
      .doc(currentUser.uid)
      .delete()
      .then(() => {
        console.log("User in database deleted");
        //delete user from auth
        deleteUserAuth();
      })
      .catch((e) => {
        console.log(e.message);
        Alert.alert("Failed to close account", e.message);
      });
  };
  //delete user from auth
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
              style={{ fontSize: 13, color: colors.brown, marginBottom: 5 }}
            >
              As a merchant, all your unshipped orders and ongoing groupbuy
              orders wil be automatically refunded back to your customers.
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

export default AuthenticateAndDeleteModal2;
