import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Yup from "yup";
import Screen from "../components/Screen";
import CheckoutAddressListItem from "../components/lists/CheckoutAddressListItem";
import colors from "../config/colors";
import Icon from "../components/Icon";
import AppText from "../components/AppText";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import AddressListItem from "../components/lists/AddressListItem";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
} from "../components/forms";
//BackEnd
import AuthApi from "../api/auth";
import axios from "axios";
import { PaymentsStripe as Stripe } from "expo-payments-stripe";
import { useFocusEffect } from "@react-navigation/native";
import db from "../api/db";
import * as firebase from "firebase";
import Counter from "react-native-counters";
//Navigation
import routes from "../navigation/routes";

const validationSchema = Yup.object().shape({
  address: Yup.string().required("Address is required"),
  unitno: Yup.string().required("Unit Number is required"),
  postal_code: Yup.string()
    .required("Postal Code is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Must be exactly 6 digits")
    .max(6, "Must be exactly 6 digits"),
});

function GroupBuyCheckoutScreen({ route, navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const listingId = route.params;
  const [cart, setCart] = useState([]);
  const [listing, setListing] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sourceList, setSourceList] = useState([]);
  const [shippings, setShippings] = useState([]);
  const [currentShipping, setCurrentShipping] = useState(null);
  const [payableTotal, setPayableTotal] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [paymentOption, setPaymentOption] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(1);
  const mounted = useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      console.log("mounted");
      mounted.current = true;
      if (mounted.current) {
        setLoading(true);

        var subscriber = db
          .collection("all_listings")
          .doc(listingId)
          .onSnapshot(
            (doc) => {
              if (doc.exists) {
                if (mounted.current) {
                  setCart(() => [
                    { ...doc.data(), count: count, key: doc.data().listingId },
                  ]);
                  setListing({ ...doc.data(), count: count });

                  if (mounted.current) {
                    setOrderTotal(
                      parseFloat(doc.data().discountedPrice) * count
                    );
                    setPayableTotal(
                      parseFloat(doc.data().discountedPrice) * count + 1.99
                    );
                    getShippingAddress();
                  }
                }
              } else {
                console.log("Listing has been deleted");
                Alert.alert("Error", "Listing has been deleted");
                navigation.goBack();
              }
            },
            (error) => {
              // Error catching for listing query
              console.log(error.message);
              Alert.alert("Error", error.message);
              navigation.goBack();
            }
          );
      }

      return () => {
        console.log("unmounted");
        mounted.current = false;
        subscriber();
      };
    }, [])
  );

  const getShippingAddress = () => {
    if (currentUser.shippingAddress) {
      var i = 0;
      var addresses = [];
      currentUser.shippingAddress.forEach((address) => {
        if (address.isDefault == true) {
          setCurrentShipping(address);
        }
        addresses.push({
          //(push as an object)
          ...address,
          key: i.toString(), // key must be a string
        });

        i = i + 1;
      });

      console.log("Addresses set");
      setShippings(addresses);
      retrieveCustomer();
    } else {
      console.log("No address");
      setShippings([]);
      retrieveCustomer();
    }
  };

  //Get customer details to get default source id
  const retrieveCustomer = () => {
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/retrieveCustomer",
      data: {
        cust_id: currentUser.cus_id, // currentUser.cus_id,
      },
    })
      .then(({ _, data }) => {
        if (mounted.current == true) {
          setCustomer(data);
          getCardSources(data);
        }
      })
      .catch((error) => {
        if (mounted.current == true) {
          console.log("Error : ", error.message);
          Alert.alert("Error", error.message);
          setLoading(false);
        }
      });
  };

  // get source list
  const getCardSources = (customer) => {
    console.log("Getting Card sources");
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/listCardSources",
      data: {
        cust_id: currentUser.cus_id, // currentUser.cus_id,
      },
    })
      .then(({ _, data }) => {
        // console.log(data.data[0]);
        // console.log(data.data);
        if (data.data.length != 0) {
          var sourcelist = [];
          data.data.forEach((source) => {
            // console.log(source);

            sourcelist.push({
              //(push as an object)
              id: source.id,
              last4: source.last4,
              key: source.id,
            });

            // setLoading(false);
          });
          if (mounted.current == true) {
            console.log("Successfully gotten Card sources");
            let defaultpayment = sourcelist.filter(
              (item) => item.id === customer.default_source
            );
            setPaymentOption(defaultpayment[0]);

            setSourceList(sourcelist);
            setLoading(false);
          }
        } else {
          if (mounted.current == true) {
            setPaymentOption(null);
            setSourceList([]);
            console.log("No Sources");
            setLoading(false);
          }
        }
      })
      .catch((error) => {
        if (mounted.current == true) {
          console.log("Error : ", error.message);
          Alert.alert("Error", error.message);
          setLoading(false);
        }
      });
  };
  ////////////////////////////////////////////////////////////////

  // Add address functions
  const handleSubmit = (address) => {
    setLoading(true);
    setAddAddressModalVisible(false);
    addAddress(address);
  };

  const handleCancel = () => {
    setAddAddressModalVisible(false);
  };

  const addAddress = (address) => {
    setLoading(true);
    console.log("Adding address");

    setShippings(() => [address]);
    db.collection("users")
      .doc(currentUser.uid)
      .update({
        shippingAddress: [
          {
            address: address.address,
            unitno: address.unitno,
            postal_code: address.postal_code,
            isDefault: true,
          },
        ],
      })
      .then(() => {
        console.log("Added Shipping Address");
        refreshShippingAddress();
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      });
  };

  const refreshShippingAddress = () => {
    db.collection("users")
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        var i = 0;
        var addresses = [];
        doc.data().shippingAddress.forEach((address) => {
          if (address.isDefault == true) {
            setCurrentShipping(address);
          }
          addresses.push({
            //(push as an object)
            ...address,
            key: i.toString(), // key must be a string
          });

          i = i + 1;
        });
        console.log("Addresses set");
        setShippings(addresses);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Fail to retrieve address for refresh", error.message);
        Alert.alert("Fail to retrieve address from database", error.message);
      });
  };

  // Add Card Functions /////////////////////////////////////
  const getToken = () => {
    Stripe.setOptionsAsync({
      publishableKey:
        "pk_test_51IcPqUGtUzx3ZmTbhejEutSdJPmxgIYt8MIFJMuub6RSfRaASxU2Db9LwJNUAQdcTTsQCulLk4LU7jw2ca7jplKB00NKDHVNFh", // Your key
    });

    Stripe.paymentRequestWithCardFormAsync()
      .then((data) => {
        setLoading(true);
        console.log("created card token");
        addCardToSource(data.tokenId);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  };

  const addCardToSource = (cardToken) => {
    console.log("Adding to source");
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/addCardToSource",
      data: {
        cust_id: currentUser.cus_id, // currentUser.cus_id,
        cardToken: cardToken,
      },
    })
      .then(({ _, data }) => {
        setPaymentOption(data);
        setSourceList([data]);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      });
  };

  const handlePlaceOrder = () => {
    if (paymentOption && currentShipping) {
      setLoading(true);
      setError(null);
      makePayment();
    } else {
      // set error to please pick a payment option and a shipping address
      Alert.alert(
        "Insufficient checkout information",
        "Please pick a payment option and a shipping address for your order"
      );
    }
  };

  const makePayment = () => {
    // setLoading(true);

    var description = "Order Item(s):\n";
    var i = 0;
    for (; i < cart.length; i++) {
      description =
        description + cart[i].title + "            x" + cart[i].count + "\n";
    }

    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/completePaymentWithStripe",
      data: {
        amount: Math.round(((payableTotal * 100) / 100) * 100), // amount = 1000 = SG$10
        currency: "sgd",
        // token: "tok_bypassPending",
        customer: customer.id,
        source: paymentOption.id,
        description: description,
        receipt_email: currentUser.email,
        address: currentShipping,
        name: currentUser.first_name + " " + currentUser.last_name,
      },
    })
      .then(({ _, data }) => {
        console.log("Successfully charged customer");
        console.log(data);
        createTransactionStatement(data.id);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", "Payment Failed: " + error.message);
        setLoading(false);
      });
  };

  const createTransactionStatement = (charge_id) => {
    console.log(charge_id);
    var currentTime = new Date();
    const timeNow = firebase.firestore.Timestamp.fromDate(currentTime);
    var ref = db.collection("transactions").doc();
    ref
      .set({
        product_title: listing.title,
        product_id: listing.listingId,
        transaction_id: ref.id,
        shippedDate: null,
        shipping: currentShipping,
        buyer_name: currentUser.first_name + " " + currentUser.last_name,
        seller_id: listing.seller,
        store_name: listing.store_name,
        store_logo: listing.seller_logo,
        charge_id: charge_id,
        buyer_id: currentUser.uid,
        image: listing.images[0],
        count: listing.count,
        original_price: listing.price,
        discount: Number(listing.discount),
        paid: Number(listing.discountedPrice * listing.count),
        orderDate: timeNow,
        estimatedDeliveryTime: null,
        confirmedDeliveryTime: null,
        status: 1,
        groupbuy: true,
        voucher: null,
      })
      .then(() => {
        console.log("Successfully created " + listing.title + " transaction");
        if (listing.groupbuyId) {
          console.log("there is an active group buy");
          joinGroup();
        } else {
          console.log("No active group buy");
          createGroup();
        }
      })
      .catch((error) => {
        console.log(
          "Failed to update " + listing.title + " transaction in database : ",
          error.message
        );
        Alert.alert("Failed to update database", error.message);
      });
  };

  const createGroup = () => {
    // Days in seconds + Hours in seconds + Minutes in seconds
    const expIn =
      listing.timelimitDays * 86400 +
      listing.timelimitHours * 3600 +
      listing.timelimitMinutes * 60;
    const timeNow = firebase.firestore.Timestamp.now();
    let createdAt = timeNow.toDate();
    createdAt.setSeconds(createdAt.getSeconds() + expIn);
    const timeExpireAt = firebase.firestore.Timestamp.fromDate(createdAt);
    console.log("Creating new group buy");
    db.collection("all_listings") // updating global listings
      .doc(listing.listingId) // listingId and groupbuyId is the same id
      .update({
        groupbuyId: listing.listingId,
        timeStart: timeNow,
        timeEnd: timeExpireAt,
        currentOrderCount: 1,
        groupbuyPayout: listing.discountedPrice * count,
        groupbuyTotalPurchases: count,
        groupbuyStatus: "Ongoing",
        shoppers: [currentUser.uid],
        quantity: listing.quantity - count,
      })
      .then(() => {
        const ref = db.collection("users").doc(currentUser.uid);
        ref
          .get()
          .then((doc) => {
            if (doc.data().inGroupBuys) {
              // if user has an existing group buy
              ref
                .update({
                  // Updating using union
                  inGroupBuys: firebase.firestore.FieldValue.arrayUnion(
                    listing.listingId
                  ),
                })
                .then(() => {
                  console.log("Successfully updated inGroupBuys using union");
                  navigation.navigate(routes.GBORDERCONFIRMED, {
                    currentShipping: currentShipping,
                    cart: [
                      {
                        listingId: listing.listingId,
                        title: listing.title,
                        images: listing.images,
                        count: count,
                        discountedPrice: listing.discountedPrice,
                        store_name: listing.store_name,
                      },
                    ],
                  });
                })
                .catch((error) => {
                  console.log("Retreiving user info error", error.message);
                  Alert.alert("Retreiving user info error", error.message);
                });
            } else {
              // if user is not a member of any group buy, means inGroupBuys will return null
              ref
                .update({
                  // update by setting an new array
                  inGroupBuys: [listing.listingId],
                })
                .then(() => {
                  console.log(
                    "Successfully updated inGroupBuys using new array"
                  );
                  navigation.navigate(routes.GBORDERCONFIRMED, {
                    currentShipping: currentShipping,
                    cart: [
                      {
                        listingId: listing.listingId,
                        title: listing.title,
                        images: listing.images,
                        count: count,
                        discountedPrice: listing.discountedPrice,
                        store_name: listing.store_name,
                      },
                    ],
                  });
                })
                .catch((error) => {
                  console.log("Retreiving user info error", error.message);
                  Alert.alert("Retreiving user info error", error.message);
                });
            }
          })
          .catch((error) => {
            console.log("Retreiving user info error", error.message);
            Alert.alert("Retreiving user info error", error.message);
          });
      })
      .catch(() => {
        console.log("Updating groupbuy information in all_listings error.");
        Alert.alert(
          "Updating groupbuy information in all_listings error",
          error.message
        );
      });
  };

  const joinGroup = () => {
    if (listing) {
      console.log("Joining existing group buy");
      //Updates groupbuy info with new member uid and increment order count by 1
      db.collection("all_listings")
        .doc(listing.groupbuyId)
        .update({
          shoppers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
          currentOrderCount: firebase.firestore.FieldValue.increment(1),
          groupbuyPayout:
            listing.groupbuyPayout + listing.discountedPrice * count,
          groupbuyTotalPurchases: listing.groupbuyTotalPurchases + count,
          quantity: listing.quantity - count,
        })
        .then(() => {
          const ref = db.collection("users").doc(currentUser.uid);
          ref
            .get()
            .then((doc) => {
              if (doc.data().inGroupBuys) {
                // if user has an existing group buy
                ref
                  .update({
                    // Updating using union
                    inGroupBuys: firebase.firestore.FieldValue.arrayUnion(
                      listing.groupbuyId
                    ),
                  })
                  .then(() => {
                    console.log("Successfully updated inGroupBuys using union");
                    navigation.navigate(routes.GBORDERCONFIRMED, {
                      currentShipping: currentShipping,
                      cart: [
                        {
                          listingId: listing.listingId,
                          title: listing.title,
                          images: listing.images,
                          count: count,
                          discountedPrice: listing.discountedPrice,
                          store_name: listing.store_name,
                        },
                      ],
                    });
                  })
                  .catch((error) => {
                    console.log("Retreiving user info error", error.message);
                  });
              } else {
                // if user is not a member of any group buy, means inGroupBuys will return null
                ref
                  .update({
                    // update by setting an new array
                    inGroupBuys: [listing.groupbuyId],
                  })
                  .then(() => {
                    console.log(
                      "Successfully updated inGroupBuys using new array"
                    );
                    navigation.navigate(routes.GBORDERCONFIRMED, {
                      currentShipping: currentShipping,
                      cart: [
                        {
                          listingId: listing.listingId,
                          title: listing.title,
                          images: listing.images,
                          count: count,
                          discountedPrice: listing.discountedPrice,
                          store_name: listing.store_name,
                        },
                      ],
                    });
                  })
                  .catch((error) => {
                    console.log("Retreiving user info error", error.message);
                    Alert.alert("Retreiving user info error", error.message);
                  });
              }
            })
            .catch((error) => {
              console.log("Retreiving user info error", error.message);
              Alert.alert("Retreiving user info error", error.message);
            });
        })
        .catch((error) => {
          console.log("Updating group buy member error :", error.message);
          Alert.alert("Retreiving user info error", error.message);
        });
    } else {
      console.log("Group buy id is null. May have been deleted");
      Alert.alert("Error", "Group buy may have been deleted");
    }
  };

  const renderHeader = () => {
    return (
      <View style={{ marginBottom: 10 }}>
        <CheckoutAddressListItem
          title='Delivery Address'
          subTitle={
            currentShipping
              ? currentShipping.address + ", #" + currentShipping.unitno
              : "No address"
          }
          bottomTitle={
            currentShipping
              ? currentShipping.postal_code
              : "Click to add a new shipping address"
          }
          onPress={() => {
            if (currentShipping) {
              setAddressModalVisible(true);
            } else {
              // click to bring up add shipping modal
              setAddAddressModalVisible(true);
            }
          }}
        />
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={{ marginBottom: 20 }}>
        {/* Order Total section */}
        <View
          style={{
            backgroundColor: colors.white,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <AppText>Order Total:</AppText>
          <AppText style={{ fontWeight: "bold", color: colors.chocolate }}>
            {"$" + orderTotal.toFixed(2)}
          </AppText>
        </View>

        {/* Payment Option Section */}
        <View>
          <AppText
            style={{
              marginLeft: 10,
              fontSize: 13,
              color: colors.muted,
              marginBottom: 5,
            }}
          >
            Payment Option
          </AppText>
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <AddressListItem
              title='Credit / Debit Card'
              subTitle={
                paymentOption
                  ? "****" + paymentOption.last4
                  : "Add a payment option"
              }
              IconComponent={
                <Icon
                  name='credit-card'
                  backgroundColor={colors.white}
                  iconColor='black'
                  size={30}
                />
              }
              onPress={() => {
                paymentOption ? setPaymentModalVisible(true) : getToken();
              }}
            />
          </View>
        </View>

        {/* Calculation Display section */}
        <View style={{ backgroundColor: colors.white, padding: 10 }}>
          {/* Merchandise total */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <AppText style={{ color: colors.muted, fontSize: 15 }}>
              Order Subtotal
            </AppText>
            <AppText style={{ color: colors.muted, fontSize: 15 }}>
              {"$" + orderTotal.toFixed(2)}
            </AppText>
          </View>
          {/* Shipping total */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <AppText style={{ color: colors.muted, fontSize: 15 }}>
              Shipping Subtotal (*fixed for all orders)
            </AppText>
            <AppText style={{ color: colors.muted, fontSize: 15 }}>
              $1.99
            </AppText>
          </View>

          {/* Total Payable */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <AppText style={{ fontSize: 18 }}>Payable Total</AppText>
            <AppText style={{ color: colors.orangered, fontSize: 18 }}>
              {"$" + payableTotal.toFixed(2)}
            </AppText>
          </View>
        </View>
        <AppButton title='Place Order' onPress={() => handlePlaceOrder()} />
      </View>
    );
  };

  const onChange = (number, item) => {
    setOrderTotal(parseFloat(item.discountedPrice) * number);
    item.count = number;
    listing.count = number;
    setPayableTotal(parseFloat(item.discountedPrice) * number + 1.99);
    setCount(number);
    //item.count = number
  };
  return (
    <Screen style={styles.container}>
      <AppActivityIndicator visible={loading} />
      <FlatList
        data={cart}
        keyExtractor={(item) => item.listingId}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 5 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.white,
              }}
            >
              <Icon
                name='storefront'
                backgroundColor={colors.white}
                iconColor='black'
              />
              <AppText
                style={{
                  fontSize: 15,
                  width: 200,
                }}
                numberOfLines={1}
              >
                {item.store_name}
              </AppText>
            </View>
            <ListItemSeperator />
            <View
              style={{ backgroundColor: colors.white, flexDirection: "row" }}
            >
              <Image source={{ uri: item.images[0] }} style={styles.image} />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <AppText
                  style={{ fontSize: 17, marginTop: 5, width: 250 }}
                  numberOfLines={1}
                >
                  {item.title}
                </AppText>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    width: 280,
                    marginBottom: 10,
                    paddingRight: 20,
                  }}
                >
                  <View>
                    <AppText
                      style={{
                        color: colors.muted,
                        fontSize: 15,
                        marginBottom: 5,
                      }}
                      numberOfLines={1}
                    >
                      {"$" + item.discountedPrice}
                    </AppText>
                  </View>
                  <Counter
                    buttonStyle={{
                      borderColor: "#333",
                      borderWidth: 2,
                      borderRadius: 25,
                    }}
                    buttonTextStyle={{
                      color: "#333",
                    }}
                    countTextStyle={{
                      color: "#333",
                    }}
                    start={item.quantity <= 0 ? 0 : 1}
                    min={item.quantity <= 0 ? 0 : 1}
                    max={
                      item.quantity <= 0
                        ? 0
                        : item.quantity < item.buylimit
                        ? item.quantity
                        : item.buylimit
                    }
                    //Change order to item.count
                    onChange={(number) => onChange(number, item)}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
        ItemSeparatorComponent={ListItemSeperator}
      />

      {/* Modal for Payment Option */}
      <Modal transparent={true} visible={paymentModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalBoxContainer}>
            <View
              style={{
                backgroundColor: colors.grey,
                height: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText style={{ fontSize: 13, color: colors.white }}>
                Select your payment option
              </AppText>
            </View>
            <FlatList
              data={sourceList}
              renderItem={({ item }) => (
                <AddressListItem
                  title={item.last4}
                  subTitle={item.id == customer.default_source && "Default"}
                  IconComponent={
                    <Icon
                      name='credit-card'
                      backgroundColor={colors.white}
                      iconColor='black'
                    />
                  }
                  onPress={() => {
                    setPaymentOption(item);
                    setPaymentModalVisible(false);
                  }}
                />
              )}
              ItemSeparatorComponent={ListItemSeperator}
            />

            <TouchableWithoutFeedback
              style={{
                height: 20,
              }}
              onPress={() => setPaymentModalVisible(false)}
            >
              <View
                style={{
                  backgroundColor: colors.lightslategrey,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 13, color: colors.white }}>
                  Cancel
                </AppText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>

      {/* Modal for Address */}
      <Modal transparent={true} visible={addressModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalBoxContainer2}>
            <View
              style={{
                backgroundColor: colors.grey,
                height: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText style={{ fontSize: 13, color: colors.white }}>
                Select your delivery address
              </AppText>
            </View>
            <FlatList
              data={shippings}
              renderItem={({ item }) => (
                <AddressListItem
                  title={item.address + ", #" + item.unitno}
                  subTitle={item.isDefault == true && "Default"}
                  bottomTitle={item.postal_code}
                  titleStyle={{ width: 200 }}
                  onPress={() => {
                    setCurrentShipping(item);
                    setAddressModalVisible(false);
                  }}
                />
              )}
              ItemSeparatorComponent={ListItemSeperator}
            />

            <TouchableWithoutFeedback
              style={{
                height: 20,
              }}
              onPress={() => setAddressModalVisible(false)}
            >
              <View
                style={{
                  backgroundColor: colors.lightslategrey,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 13, color: colors.white }}>
                  Cancel
                </AppText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>

      {/* Modal for form to add new address */}
      <Modal transparent={true} visible={addAddressModalVisible}>
        <View style={styles.modal}>
          <View style={[styles.modalBoxContainer2, { paddingHorizontal: 10 }]}>
            <View
              style={{
                backgroundColor: colors.white,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText style={{ fontSize: 13, color: colors.grey }}>
                Add new shipping address
              </AppText>
            </View>
            <AppForm
              initialValues={{
                address: "",
                unitno: "",
                postal_code: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppFormField
                autoCorrect={false}
                autoCompleteType='street-address'
                icon='home-edit'
                maxLength={40}
                name='address'
                placeholder='Address'
                textContentType='streetAddressLine1'
                numberOfLines={1}
              />
              <AppFormField
                autoCorrect={false}
                autoCapitalize='none'
                icon='home-edit'
                maxLength={7}
                keyboardType='numeric'
                width='80%'
                name='unitno'
                placeholder='Unit No #'
              />
              <AppFormField
                autoCapitalize='none'
                autoCorrect={false}
                icon='home-edit'
                maxLength={6}
                keyboardType='numeric'
                width='80%'
                name='postal_code'
                placeholder='Postal Code'
                textContentType='postalCode'
              />
              <Error_Message error={error} visible={error} />
              <View style={{ marginVertical: 10, alignItems: "center" }}>
                <SubmitButton title='Add Address' />
                <View style={{ marginTop: 5 }}>
                  <TouchableHighlight
                    onPress={handleCancel}
                    underlayColor={colors.white}
                  >
                    <AppText
                      style={{ color: colors.muted, fontWeight: "bold" }}
                    >
                      Cancel
                    </AppText>
                  </TouchableHighlight>
                </View>
              </View>
            </AppForm>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.whitegrey, paddingTop: 0 },
  image: {
    width: 80,
    height: 80,
    marginHorizontal: 10,
    marginVertical: 5,
    resizeMode: "contain",
  },
  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
  },
  modalBoxContainer: {
    backgroundColor: colors.white,
    margin: 50,
    marginTop: 100,
    borderRadius: 5,
  },
  modalBoxContainer2: {
    backgroundColor: colors.white,
    margin: 10,
    marginTop: 100,
    borderRadius: 5,
  },

  buttonYesContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderColor: colors.whitegrey,
    width: "50%",
  },
  buttonNoContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.whitegrey,
    width: "50%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    width: "100%",
    height: "40%",
  },
});

export default GroupBuyCheckoutScreen;
