import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Alert,
  TouchableHighlight,
} from "react-native";

import ToShipListItem from "../components/lists/ToShipListItem";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import ListItemSeperator from "../components/lists/ListItemSeperator";
//BackEnd
import AuthApi from "../api/auth";
import db from "../api/db";
import * as firebase from "firebase";
import axios from "axios";
//Navigation
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";

//style properties of items on page
function ToShipScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setLoading(true);
    const sub = db
      .collection("transactions")
      .where("buyer_id", "==", currentUser.uid)
      .orderBy("status", "desc")
      .where("status", "<", 5)
      .where("status", ">=", 3)
      .orderBy("orderDate", "desc")
      .onSnapshot(
        (transactions) => {
          const updatedOrders = [];
          transactions.forEach((transaction) => {
            var refundDeadline = transaction.data().orderDate.toDate();
            refundDeadline.setHours(refundDeadline.getHours() + 3);
            if (new Date() < refundDeadline) {
              var viableForRefund = true;
            } else {
              var viableForRefund = false;
            }
            updatedOrders.push({
              ...transaction.data(),
              viableForRefund: viableForRefund,
            });
          });
          setOrders(updatedOrders);
          setLoading(false);
        },
        (error) => {
          console.log(error.message);
          Alert.alert(
            "Fail to communicate with database",
            "Please try again later"
          );
          setLoading(false);
        }
      );
    return () => {
      sub();
    };
  }, []);

  const handleRefund = (item) => {
    setLoading2(true);
    var refundDeadline = item.orderDate.toDate();
    refundDeadline.setHours(refundDeadline.getHours() + 3);
    if (new Date() < refundDeadline) {
      db.collection("transactions")
        .doc(item.transaction_id)
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
              charge_id: item.charge_id,
            },
          })
            .then(({ _, data }) => {
              console.log("Refunded");
              Alert.alert(
                "Refunded",
                "Item has been refunded. It may take a few days to reflect on your statement."
              );
              setLoading2(false);
            })
            .catch((error) => {
              console.log("Error : ", error.message);
              Alert.alert(
                "Refund Failed",
                "Please try again in a few minutes or contact the administrator."
              );
              setLoading2(false);
            });
        })
        .catch((err) => {
          console.log("Error: ", err.message);
          Alert.alert(
            "Error updating databse",
            "Please try again in a few minutes or contact the administrator"
          );
          setLoading2(false);
        });
    } else {
      Alert.alert(
        "Refund Failed",
        " Your grace period (3 hours after ordering) has expired."
      );
      setLoading2(false);
    }
  };

  const handleReleasePayment = (item) => {
    setLoading2(true);
    db.collection("transactions")
      .doc(item.transaction_id)
      .update({
        status: 5,
        confirmedDeliveryTime: firebase.firestore.Timestamp.now(),
      })
      .then(() => {
        db.collection("users")
          .doc(item.seller_id)
          .get()
          .then((seller) => {
            if (seller.exists) {
              axios({
                // issueing refund using cloud functiosn to communicate with stripe api
                method: "POST",
                url:
                  "https://us-central1-buyfne-63905.cloudfunctions.net/releasePaymentToSeller",
                data: {
                  paid: Math.round(((item.paid * 100) / 100) * 100),
                  stripe_id: seller.data().stripe_id,
                },
              })
                .then(({ _, data }) => {
                  console.log("Released");
                  Alert.alert(
                    "Delivery Confirmed",
                    "Payment has been released to seller."
                  );
                  setLoading2(false);
                })
                .catch((error) => {
                  console.log("Error : ", error.message);
                  Alert.alert(
                    "Delivery Confirmed Error",
                    "Failed to release payment to seller. Please contact the administrator."
                  );
                  setLoading2(false);
                });
            } else {
              Alert.alert(
                "Fail to release payment to seller.",
                "Seller does not exist "
              );
              setLoading2(false);
            }
          })
          .catch((err) => {
            console.log("Fail to retrieve seller: ", err.message);
            Alert.alert(
              "Delivery Confirmed Error.",
              "Failed to release payment to seller. Please contact the administrator "
            );
            setLoading2(false);
          });
      })
      .catch((err) => {
        console.log(err.message);
        Alert.alert(
          "Failed",
          "Failed to confirm delivery. Please try again later"
        );
        setLoading2(false);
      });
  };
  return (
    <>
      <AppActivityIndicator visible={loading2} />
      <AppActivityIndicator visible={loading} />
      <Screen style={styles.container}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.transaction_id}
          renderItem={({ item }) => (
            <>
              <ToShipListItem item={item} />
              <ListItemSeperator />
              <View
                style={{
                  backgroundColor: colors.white,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginBottom: 20,
                }}
              >
                <TouchableHighlight
                  style={{
                    padding: 8,
                    backgroundColor: colors.darkslategrey,

                    borderRadius: 10,
                  }}
                  onPress={() =>
                    navigation.navigate(routes.RECEIPT, {
                      ...item,
                      orderDate: item.orderDate.toDate().toDateString(),
                      shippedDate: item.shippedDate
                        ? item.shippedDate.toDate().toDateString()
                        : null,
                      estimatedDeliveryTime: item.estimatedDeliveryTime
                        .toDate()
                        .toDateString(),
                      confirmedDeliveryTime: item.confirmedDeliveryTime
                        ? item.confirmedDeliveryTime.toDate().toDateString()
                        : item.confirmedDeliveryTime,
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name='receipt'
                      size={17}
                      color={colors.white}
                      style={{ marginRight: 5 }}
                    />
                    <AppText
                      style={{
                        color: colors.white,
                        fontSize: 15,
                        fontWeight: "bold",
                        fontFamily: "sans-serif-medium",
                      }}
                    >
                      Receipt
                    </AppText>
                  </View>
                </TouchableHighlight>
                {item.status == 4 ? (
                  <TouchableHighlight
                    style={{
                      padding: 8,
                      backgroundColor: colors.teal,
                      borderRadius: 10,
                    }}
                    onPress={() => handleReleasePayment(item)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='truck-check'
                        size={17}
                        color={colors.white}
                        style={{ marginRight: 5 }}
                      />
                      <AppText
                        style={{
                          color: colors.white,
                          fontSize: 15,
                          fontWeight: "bold",
                          fontFamily: "sans-serif-medium",
                        }}
                      >
                        Confirm Delivery
                      </AppText>
                    </View>
                  </TouchableHighlight>
                ) : (
                  item.viableForRefund &&
                  !item.groupbuy && (
                    <TouchableHighlight
                      style={{
                        padding: 8,
                        backgroundColor: colors.teal,
                        borderRadius: 10,
                      }}
                      onPress={() => handleRefund(item)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name='credit-card-refund'
                          size={17}
                          color={colors.white}
                          style={{ marginRight: 5 }}
                        />
                        <AppText
                          style={{
                            color: colors.white,
                            fontSize: 15,
                            fontWeight: "bold",
                            fontFamily: "sans-serif-medium",
                          }}
                        >
                          Refund
                        </AppText>
                      </View>
                    </TouchableHighlight>
                  )
                )}
              </View>
            </>
          )}
        />
      </Screen>
      {/* <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalBoxContainer}>
            <View style={styles.switchTextContainer}>
              <AppText style={styles.switchText}>
                Set this card as default?
              </AppText>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableHighlight
                underlayColor={colors.sienna}
                activeOpacity={0.5}
                style={styles.buttonYesContainer}
                onPress={handleYes}
              >
                <AppText style={{ color: colors.darkorange }}>Yes</AppText>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={colors.brown}
                activeOpacity={0.5}
                style={styles.buttonNoContainer}
                onPress={handleNo}
              >
                <AppText style={{ color: colors.brightred }}>No</AppText>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal> */}
    </>
  );
}

const styles = StyleSheet.create({
  //container properties
  container: {
    paddingTop: 0,
    backgroundColor: colors.whitegrey,
  },
});

export default ToShipScreen;
