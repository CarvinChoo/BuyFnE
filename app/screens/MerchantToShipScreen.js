import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  View,
  FlatList,
  TouchableHighlight,
} from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
//Backend
import db from "../api/db";
import AuthApi from "../api/auth"; // for context
import * as firebase from "firebase";
import axios from "axios";
function MerchantToShipScreen() {
  const { listingId } = useContext(AuthApi.AuthContext);
  const [groupbuy, setGroupBuy] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub1 = db
      .collection("all_listings")
      .doc(listingId)
      .onSnapshot(
        (query) => {
          setGroupBuy(query.data());
        },
        (error) => {
          console.log(error.message);
          Alert.alert("Error", "Unable to retrieve listing from database");
        }
      );

    return () => {
      sub1();
    };
  }, []);

  useEffect(() => {
    const sub2 = db
      .collection("transactions")
      .where("product_id", "==", listingId)
      .where("status", "==", 3)
      .orderBy("orderDate", "desc")
      .onSnapshot(
        (query) => {
          var transac = [];
          query.forEach((transaction) => {
            transac.push(transaction.data());
          });
          setTransactions(transac);
        },
        (error) => {
          console.log(error.message);
          Alert.alert("Error", "Unable to retrieve transactions from database");
        }
      );
    return () => {
      console.log("unmounted");
      sub2();
    };
  }, []);

  const confirmGroupbuy = () => {
    setLoading(true);
    db.collection("all_listings")
      .doc(listingId)
      .update({
        groupbuyId: null,
      })
      .then(() => {
        db.collection("transactions")
          .where("product_id", "==", listingId)
          .where("status", "==", 2)
          .get()
          .then((transactions) => {
            if (!transactions.empty) {
              const promises = [];

              var deliveryTime = new Date();
              const twoWeeks = 14;
              deliveryTime.setDate(deliveryTime.getDate() + twoWeeks);
              const estimatedDeliveryTime = firebase.firestore.Timestamp.fromDate(
                deliveryTime
              );
              transactions.forEach((transac) => {
                promises.push(
                  transac.ref
                    .update({
                      status: 3, // To Ship
                      estimatedDeliveryTime: estimatedDeliveryTime,
                    })
                    .then(() => {
                      console.log("Updated Transaction");
                    })
                    .catch((err) => {
                      console.log("Error updating transactions: ");
                      console.log(err.message);
                    })
                );
              });

              Promise.all(promises)
                .then(() => {
                  // Perform removal of group buy from user array
                  db.collection("users")
                    .where("inGroupBuys", "array-contains", groupbuy.listingId)
                    .get()
                    .then((users) => {
                      const promises2 = [];
                      users.forEach((user) => {
                        if (groupbuy.milestone1) {
                          //got milestone 1
                          if (
                            groupbuy.currentOrderCount <
                            groupbuy.milestone1_settings.orders_quota
                          ) {
                            //fail to reach quota
                            promises2.push(
                              user.ref
                                .update({
                                  //removes successful group buy from array
                                  inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                    groupbuy.listingId
                                  ),
                                })
                                .then(() => {
                                  console.log("user updated");
                                })
                                .catch((err) => {
                                  console.log("user fail to update");
                                })
                            );
                          } else {
                            //reach quota 1
                            if (groupbuy.milestone2) {
                              // got milestone 2
                              if (
                                groupbuy.currentOrderCount <
                                groupbuy.milestone2_settings.orders_quota
                              ) {
                                //fail to reach quota
                                var rewards = [
                                  groupbuy.milestone1_settings.reward
                                    .voucher_id,
                                ];
                                if (user.data().vouchers) {
                                  promises2.push(
                                    user.ref
                                      .update({
                                        //removes successful group buy from array
                                        inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                          groupbuy.listingId
                                        ),
                                        vouchers: firebase.firestore.FieldValue.arrayUnion(
                                          ...rewards
                                        ),
                                      })
                                      .then(() => {
                                        console.log("user updated");
                                      })
                                      .catch((err) => {
                                        console.log("user fail to update");
                                      })
                                  );
                                } else {
                                  promises2.push(
                                    user.ref
                                      .update({
                                        //removes successful group buy from array
                                        inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                          groupbuy.listingId
                                        ),
                                        vouchers: rewards,
                                      })
                                      .then(() => {
                                        console.log("user updated");
                                      })
                                      .catch((err) => {
                                        console.log("user fail to update");
                                      })
                                  );
                                }
                              } else {
                                //reach quota 2
                                if (groupbuy.milestone3) {
                                  // got milestone 3
                                  if (
                                    groupbuy.currentOrderCount <
                                    groupbuy.milestone3_settings.orders_quota
                                  ) {
                                    //fail to reach quota
                                    var rewards = [
                                      groupbuy.milestone1_settings.reward
                                        .voucher_id,
                                      groupbuy.milestone2_settings.reward
                                        .voucher_id,
                                    ];
                                    if (user.data().vouchers) {
                                      promises2.push(
                                        user.ref
                                          .update({
                                            //removes successful group buy from array
                                            inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                              groupbuy.listingId
                                            ),
                                            vouchers: firebase.firestore.FieldValue.arrayUnion(
                                              ...rewards
                                            ),
                                          })
                                          .then(() => {
                                            console.log("user updated");
                                          })
                                          .catch((err) => {
                                            console.log("user fail to update");
                                          })
                                      );
                                    } else {
                                      promises2.push(
                                        user.ref
                                          .update({
                                            //removes successful group buy from array
                                            inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                              groupbuy.listingId
                                            ),
                                            vouchers: rewards,
                                          })
                                          .then(() => {
                                            console.log("user updated");
                                          })
                                          .catch((err) => {
                                            console.log("user fail to update");
                                          })
                                      );
                                    }
                                  } else {
                                    //reach quota 3
                                    var rewards = [
                                      groupbuy.milestone1_settings.reward
                                        .voucher_id,
                                      groupbuy.milestone2_settings.reward
                                        .voucher_id,
                                      groupbuy.milestone3_settings.reward
                                        .voucher_id,
                                    ];
                                    if (user.data().vouchers) {
                                      promises2.push(
                                        user.ref
                                          .update({
                                            //removes successful group buy from array
                                            inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                              groupbuy.listingId
                                            ),
                                            vouchers: firebase.firestore.FieldValue.arrayUnion(
                                              ...rewards
                                            ),
                                          })
                                          .then(() => {
                                            console.log("user updated");
                                          })
                                          .catch((err) => {
                                            console.log("user fail to update");
                                          })
                                      );
                                    } else {
                                      promises2.push(
                                        user.ref
                                          .update({
                                            //removes successful group buy from array
                                            inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                              groupbuy.listingId
                                            ),
                                            vouchers: rewards,
                                          })
                                          .then(() => {
                                            console.log("user updated");
                                          })
                                          .catch((err) => {
                                            console.log("user fail to update");
                                          })
                                      );
                                    }
                                  }
                                } else {
                                  // no milestone 3
                                  var rewards = [
                                    groupbuy.milestone1_settings.reward
                                      .voucher_id,
                                    groupbuy.milestone2_settings.reward
                                      .voucher_id,
                                  ];
                                  if (user.data().vouchers) {
                                    promises2.push(
                                      user.ref
                                        .update({
                                          //removes successful group buy from array
                                          inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                            groupbuy.listingId
                                          ),
                                          vouchers: firebase.firestore.FieldValue.arrayUnion(
                                            ...rewards
                                          ),
                                        })
                                        .then(() => {
                                          console.log("user updated");
                                        })
                                        .catch((err) => {
                                          console.log("user fail to update");
                                        })
                                    );
                                  } else {
                                    promises2.push(
                                      user.ref
                                        .update({
                                          //removes successful group buy from array
                                          inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                            groupbuy.listingId
                                          ),
                                          vouchers: rewards,
                                        })
                                        .then(() => {
                                          console.log("user updated");
                                        })
                                        .catch((err) => {
                                          console.log("user fail to update");
                                        })
                                    );
                                  }
                                }
                              }
                            } else {
                              // no milestone 2
                              var rewards = [
                                groupbuy.milestone1_settings.reward.voucher_id,
                              ];
                              if (user.data().vouchers) {
                                promises2.push(
                                  user.ref
                                    .update({
                                      //removes successful group buy from array
                                      inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                        groupbuy.listingId
                                      ),
                                      vouchers: firebase.firestore.FieldValue.arrayUnion(
                                        ...rewards
                                      ),
                                    })
                                    .then(() => {
                                      console.log("user updated");
                                    })
                                    .catch((err) => {
                                      console.log("user fail to update");
                                    })
                                );
                              } else {
                                promises2.push(
                                  user.ref
                                    .update({
                                      //removes successful group buy from array
                                      inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                        groupbuy.listingId
                                      ),
                                      vouchers: rewards,
                                    })
                                    .then(() => {
                                      console.log("user updated");
                                    })
                                    .catch((err) => {
                                      console.log("user fail to update");
                                    })
                                );
                              }
                            }
                          }
                        } else {
                          //no milestone 1
                          promises2.push(
                            user.ref
                              .update({
                                //removes successful group buy from array
                                inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                  groupbuy.listingId
                                ),
                              })
                              .then(() => {
                                console.log("user updated");
                              })
                              .catch((err) => {
                                console.log("user fail to update");
                              })
                          );
                        }
                      });
                      Promise.all(promises2).then(() => {
                        Alert.alert(
                          "Group buy ended",
                          "All group buy transactions is ready to be shipped."
                        );
                        setLoading(false);
                      });
                    })
                    .catch((err) => {
                      console.log(err.message);
                      setLoading(false);
                    });
                })
                .catch((err) => {
                  console.log(err.message);
                  Alert.alert(
                    "Error updating transactions",
                    "Please contact administrator about the issue."
                  );
                  setLoading(false);
                });
            } else {
              console.log("No transactions");
              Alert.alert(
                "There are no transactions",
                "Unable to find any transactions"
              );
            }
          })
          .catch((err) => {
            console.log(err.message);
            Alert.alert(
              "Error communicating with database",
              "Please contact administrator about the issue"
            );
          });
      })
      .catch((err) => {
        console.log(err.message);
        Alert.alert(
          "Error communicating with database",
          "Try again in a few minutes"
        );
      });
  };

  const closeGroupbuy = () => {
    setLoading(true);
    db.collection("all_listings")
      .doc(listingId)
      .update({
        groupbuyId: null,
      })
      .then(() => {
        if (groupbuy.groupbuyStatus == "Awaiting seller confirmation") {
          db.collection("transactions")
            .where("product_id", "==", listingId)
            .where("status", "==", 2)
            .get()
            .then((transactions) => {
              if (!transactions.empty) {
                const promises = [];
                transactions.forEach((transac) => {
                  promises.push(
                    transac.ref
                      .update({
                        status: 6, //Refunded
                      })
                      .then(() => {
                        axios({
                          // issueing refund using cloud functiosn to communicate with stripe api
                          method: "POST",
                          url:
                            "https://us-central1-buyfne-63905.cloudfunctions.net/createRefund",
                          data: {
                            charge_id: transac.data().charge_id,
                          },
                        })
                          .then(({ _, data }) => {
                            console.log(data);
                            console.log("Updated Transaction");
                          })
                          .catch((error) => {
                            console.log("Error : ", error.message);
                          });
                      })
                      .catch((err) => {
                        console.log("Error updating transactions: ");
                        console.log(err.message);
                      })
                  );
                });

                Promise.all(promises)
                  .then(() => {
                    // Perform removal of group buy from user array

                    db.collection("users")
                      .where(
                        "inGroupBuys",
                        "array-contains",
                        groupbuy.listingId
                      )
                      .get()
                      .then((users) => {
                        const promises2 = [];
                        users.forEach((user) => {
                          promises2.push(
                            user.ref
                              .update({
                                //removes successful group buy from array
                                inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                                  groupbuy.listingId
                                ),
                              })
                              .then(() => {
                                console.log("user updated");
                              })
                              .catch((err) => {
                                console.log("user fail to update");
                              })
                          );
                        });
                        Promise.all(promises2).then(() => {
                          Alert.alert("Success", "Group buy Cancelled.");
                          setLoading(false);
                        });
                      })
                      .catch((err) => {
                        console.log(err.message);
                        setLoading(false);
                      });
                  })
                  .catch((err) => {
                    console.log(err.message);
                    Alert.alert(
                      "Error updating transactions",
                      "Please contact administrator about the issue."
                    );
                    setLoading(false);
                  });
              } else {
                console.log("No transactions");
                Alert.alert(
                  "There are no transactions",
                  "Unable to find any transactions"
                );
              }
              setLoading(false);
            })
            .catch((err) => {
              console.log(err.message);
              Alert.alert(
                "Error communicating with database",
                "Please contact administrator about the issue"
              );
              setLoading(false);
            });
        } else {
          // If groupbuyStatus is Unsuccessful
          db.collection("users")
            .where("inGroupBuys", "array-contains", groupbuy.listingId)
            .get()
            .then((users) => {
              const promises2 = [];
              users.forEach((user) => {
                promises2.push(
                  user.ref
                    .update({
                      //removes successful group buy from array
                      inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                        groupbuy.listingId
                      ),
                    })
                    .then(() => {
                      console.log("user updated");
                    })
                    .catch((err) => {
                      console.log("user fail to update");
                    })
                );
              });
              Promise.all(promises2).then(() => {
                Alert.alert("Success", "Failed Group buy closed.");
                setLoading(false);
              });
            })
            .catch((err) => {
              console.log(err.message);
              setLoading(false);
            });
        }
      })
      .catch((err) => {
        console.log(err.message);
        Alert.alert(
          "Error communicating with database",
          "Try again in a few minutes"
        );
        setLoading(false);
      });
  };

  const shippedOrder = (item) => {
    setLoading(true);
    db.collection("transactions")
      .doc(item.transaction_id)
      .update({
        status: 4,
        shippedDate: firebase.firestore.Timestamp.now(),
      })
      .then(() => {
        Alert.alert("Success", "Order Status changed to Shipped ");
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err.message);
        Alert.alert(
          "Error updating database",
          "Please try again in a few minutes or contact the administrator"
        );
        setLoading(false);
      });
  };

  const cancelledOrder = (item) => {
    setLoading(true);
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
            console.log(data);
            console.log("Refunded");
            Alert.alert(
              "Success",
              "Order cancelled and customer has been refunded."
            );
            setLoading(false);
          })
          .catch((error) => {
            console.log("Error : ", error.message);
            Alert.alert("Error", error.message);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log("Error: ", err.message);
        Alert.alert(
          "Error updating databse",
          "Please try again in a few minutes or contact the administrator"
        );
        setLoading(false);
      });
  };
  const renderHeader = () => {
    return (
      groupbuy &&
      groupbuy.groupbuyId && (
        <View
          style={{
            backgroundColor: colors.white,
            marginBottom: 10,
            paddingVertical: 10,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AppText style={{ fontWeight: "bold", marginBottom: 5 }}>
                Groupbuy Order
              </AppText>
              <AppText
                style={{
                  fontWeight: "bold",
                  marginBottom: 5,
                  color: colors.brightred,
                  fontSize: 13,
                }}
              >
                {groupbuy.groupbuyId
                  ? groupbuy.groupbuyStatus == "Awaiting seller confirmation"
                    ? "Status: Require confirmation"
                    : "Status: " + groupbuy.groupbuyStatus
                  : "Status: Inactive"}
              </AppText>
            </View>
            <ListItemSeperator
              style={{ marginBottom: 10, backgroundColor: colors.gray }}
            />
            <View style={{ flexDirection: "row" }}>
              <View style={{ borderWidth: 1, marginRight: 20 }}>
                <Image
                  style={{ width: 100, height: 100, resizeMode: "center" }}
                  source={{ uri: groupbuy.images[0] }}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  {groupbuy.groupbuyId
                    ? "Total Payout:  $" + groupbuy.groupbuyPayout.toFixed(2)
                    : "Total Payout:  $0.00"}
                </AppText>
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  {groupbuy.groupbuyId
                    ? "Total Purchased:  " +
                      groupbuy.groupbuyTotalPurchases +
                      " items"
                    : "Total Purchased:  0"}
                </AppText>
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  {groupbuy.groupbuyId
                    ? "Target order:  " +
                      groupbuy.currentOrderCount +
                      " / " +
                      groupbuy.minimumOrderCount
                    : "Target order:  0 / " + groupbuy.minimumOrderCount}
                </AppText>
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  {groupbuy.groupbuyId
                    ? groupbuy.currentOrderCount >= groupbuy.minimumOrderCount
                      ? "Target status:  Target Reached"
                      : "Target status:  Not Reached"
                    : "Target status: N.A."}
                </AppText>
                <AppText style={{ color: colors.darkred, fontSize: 15 }}>
                  {groupbuy.groupbuyId
                    ? "Time end: " + groupbuy.timeEnd.toDate().toDateString()
                    : "Time end: N.A."}
                </AppText>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableHighlight
                style={{
                  padding: 8,
                  backgroundColor:
                    groupbuy.groupbuyStatus == "Awaiting seller confirmation"
                      ? colors.teal
                      : colors.muted,
                  borderRadius: 10,
                }}
                onPress={() =>
                  groupbuy.groupbuyStatus == "Awaiting seller confirmation"
                    ? confirmGroupbuy()
                    : groupbuy.groupbuyStatus == "Ongoing" &&
                      Alert.alert(
                        "Group buy still ongoing",
                        "Please wait for group buy to end."
                      )
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
                    name='check-circle'
                    size={15}
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
                    Confirm Groupbuy
                  </AppText>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  padding: 8,
                  backgroundColor:
                    groupbuy.groupbuyStatus == "Awaiting seller confirmation"
                      ? colors.brightred
                      : colors.muted,

                  borderRadius: 10,
                }}
                onPress={() => {
                  groupbuy.groupbuyStatus == "Awaiting seller confirmation"
                    ? closeGroupbuy()
                    : groupbuy.groupbuyStatus == "Ongoing"
                    ? Alert.alert(
                        "Group buy still ongoing",
                        "Please wait for group buy to end."
                      )
                    : groupbuy.groupbuyStatus == "Unsuccessful " &&
                      closeGroupbuy();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name='close-circle'
                    size={15}
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
                    Close Groupbuy
                  </AppText>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      )
    );
  };
  return (
    <Screen style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.transaction_id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 20,
              backgroundColor: colors.white,
              paddingVertical: 10,
              width: "100%",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 30,
                marginBottom: 3,
              }}
            >
              <AppText style={{ fontWeight: "bold", fontSize: 18 }}>
                {item.product_title}
              </AppText>
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                {"x" + item.count}
              </AppText>
            </View>
            <ListItemSeperator />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 30,
              }}
            >
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                Paid:
              </AppText>
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                {"$" + item.paid.toFixed(2)}
              </AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 30,
              }}
            >
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                Ship to:
              </AppText>
              <AppText
                style={{
                  color: colors.muted,
                  fontSize: 15,
                  textAlign: "right",
                }}
              >
                {item.buyer_name}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 30,
              }}
            >
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                Shipping Address:
              </AppText>

              <AppText
                style={{
                  color: colors.muted,
                  fontSize: 15,
                  width: 150,
                  textAlign: "right",
                }}
                numberOfLines={3}
              >
                {item.shipping.address}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: "row-reverse",
                paddingHorizontal: 30,
              }}
            >
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                {"#" + item.shipping.unitno}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: "row-reverse",
                paddingHorizontal: 30,
              }}
            >
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                {item.shipping.postal_code}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 30,
              }}
            >
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                Status:
              </AppText>
              <AppText
                style={{
                  color: colors.cyan,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                To Ship
              </AppText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                paddingHorizontal: 30,
              }}
            >
              <TouchableHighlight
                style={{
                  padding: 8,
                  backgroundColor: colors.teal,

                  borderRadius: 10,
                }}
                onPress={() => shippedOrder(item)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name='package-variant-closed'
                    size={15}
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
                    Shipped
                  </AppText>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  padding: 8,
                  backgroundColor: colors.brightred,

                  borderRadius: 10,
                }}
                onPress={() => cancelledOrder(item)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name='close-circle'
                    size={15}
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
                    Cancel Order
                  </AppText>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.whitegrey, paddingTop: 10 },
});

export default MerchantToShipScreen;
