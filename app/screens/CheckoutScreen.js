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
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import db from "../api/db";
import * as firebase from "firebase";

//Navigation
import routes from "../navigation/routes";
import CheckoutVoucherListItem from "../components/CheckoutVoucherListItem";
import { Button } from "react-native";

const validationSchema = Yup.object().shape({
  address: Yup.string().required("Address is required"),
  unitno: Yup.string().required("Unit Number is required"),
  postal_code: Yup.string()
    .required("Postal Code is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Must be exactly 6 digits")
    .max(6, "Must be exactly 6 digits"),
});

function CheckoutScreen({ navigation }) {
  const { cart, currentUser } = useContext(AuthApi.AuthContext);

  const [orderTotal, setOrderTotal] = useState(() => {
    var i = 0;
    var len = cart.length;
    var total = 0;
    for (; i < len; i++) {
      total = total + cart[i].price * cart[i].count;
    }
    return total;
  });
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [shippings, setShippings] = useState([]);
  const [currentShipping, setCurrentShipping] = useState(null);
  const [payableTotal, setPayableTotal] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [paymentOption, setPaymentOption] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [discountTotal, setDiscountTotal] = useState();
  const [error, setError] = useState(null);
  const [countTotal, setCountTotal] = useState(() => {
    var i = 0;
    var len = cart.length;
    var total = 0;
    for (; i < len; i++) {
      total = total + cart[i].count;
    }
    return total;
  });
  const mounted = useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      console.log("mounted");
      mounted.current = true;
      if (mounted.current) {
        setLoading(true);
      }
      if (voucher) {
        // Calculate Voucher discount and deduct from payable total
      } else {
        if (mounted.current) {
          setPayableTotal(orderTotal + 1.99);
        }
      }
      if (mounted.current) {
        getVouchers();
      }

      return () => {
        console.log("unmounted");
        mounted.current = false;
      };
    }, [])
  );
  const getVouchers = () => {
    if (currentUser.vouchers) {
      const promises = [];
      const voucherlist = [];
      currentUser.vouchers.forEach((voucher_id) => {
        //individually retrieve each voucher info
        promises.push(
          db
            .collection("vouchers")
            .doc(voucher_id)
            .get()
            .then((e) => {
              if (e.exists) {
                if (e.data().category) {
                  // if admin issued voucher or store issued voucer
                  if (e.data().category == 0) {
                    // storewide voucher
                    voucherlist.push({
                      ...e.data(),
                      apply: true,
                    });
                  } else {
                    let category = cart.filter(
                      (x) => x.category == e.data().category
                    );
                    if (category.length > 0) {
                      // any category
                      let priceTotal = 0;
                      category.forEach((x) => {
                        priceTotal = priceTotal + x.price * x.count;
                      });

                      if (priceTotal > e.data().minimum_spending) {
                        voucherlist.push({
                          ...e.data(),
                          apply: true,
                        });
                      } else {
                        voucherlist.push({
                          ...e.data(),
                          apply: false,
                        });
                      }
                    } else {
                      voucherlist.push({
                        ...e.data(),
                        apply: false,
                      });
                    }
                  }
                } // store issued voucher
                else {
                  let seller = cart.filter(
                    (x) => x.seller == e.data().seller_id
                  );

                  if (seller) {
                    // any category

                    let sellerTotal = 0;
                    seller.forEach(
                      (x) => (sellerTotal = sellerTotal + x.price * x.count)
                    );
                    if (sellerTotal > e.data().minimum_spending) {
                      voucherlist.push({
                        ...e.data(),
                        apply: true,
                      });
                    } else {
                      voucherlist.push({
                        ...e.data(),
                        apply: false,
                      });
                    }
                  } else {
                    voucherlist.push({
                      ...e.data(),
                      apply: false,
                    });
                  }
                }
              }
            })
            .catch((error) => {
              console.log(error.message);
            })
        );
      });
      //Make sure each voucher is retreived
      Promise.all(promises)
        .then(() => {
          if (mounted.current) {
            setVouchers(voucherlist);
            getShippingAddress();
          }
        })
        .catch((err) => {
          if (mounted.current) {
            setVouchers([]);
            Alert.alert("Error", "Fail to retreive vouchers");
            console.log(err.message);
            setLoading(false);
          }
        });
    } else {
      setVouchers([]);
      getShippingAddress();
    }
  };
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
        console.log(data);
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
    console.log(description);
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
        updateQuantity(data.id);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", "Payment Failed: " + error.message);
        setLoading(false);
      });
  };

  const updateQuantity = (charge_id) => {
    let promises = [];

    cart.forEach((listing) => {
      const quantity = listing.quantity - listing.count;
      if (quantity < 0) {
        quantity = 0;
      }
      var payout = listing.price * listing.count;
      if (voucher) {
        if (voucher.seller_id == listing.seller) {
          // same seller
          if (voucher.percent) {
            payout = payout - (payout * voucher.percentage_discount) / 100;
            payout = Math.round(payout * 100) / 100;
          } else {
            let count = 0;
            cart.forEach((item) => {
              if (item.seller == voucher.seller_id) {
                count = count + item.count;
              }
            });
            payout = payout - (voucher.amount_discount / count) * listing.count;
            payout = Math.round(payout * 100) / 100;
          }
        } else if (
          voucher.category == listing.category ||
          voucher.category == 0
        ) {
          if (voucher.percent) {
            payout = payout - (payout * voucher.percentage_discount) / 100;
            payout = Math.round(payout * 100) / 100;
          } else {
            let count = 0;
            if (voucher.category == 0) {
              count = countTotal;
            } else {
              cart.forEach((item) => {
                if (item.category == voucher.category) {
                  count = count + item.count;
                }
              });
            }

            payout = payout - (voucher.amount_discount / count) * listing.count;
            payout = Math.round(payout * 100) / 100;
          }
        }
      }

      promises.push(
        db
          .collection("all_listings")
          .doc(listing.listingId)
          .update({
            soldCount: listing.soldCount + 1,
            quantity: quantity,
            salesTotal: listing.salesTotal + payout,
          })
          .then(() => {
            console.log("listing quantity updated");
          })
          .catch((error) => {
            console.log("Fail to update Quantity : ", error.message);
            Alert.alert("Fail to update Quantity", error.message);
            setLoading(false);
          })
      );
    });

    Promise.all(promises)
      .then(() => {
        createTransactionStatement(charge_id);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const createTransactionStatement = (charge_id) => {
    var currentTime = new Date();
    const timeNow = firebase.firestore.Timestamp.fromDate(currentTime);
    const twoWeeks = 14;
    currentTime.setDate(currentTime.getDate() + twoWeeks);
    const estimatedDeliveryTime = firebase.firestore.Timestamp.fromDate(
      currentTime
    );
    var promises = [];

    cart.forEach((item) => {
      var ref = db.collection("transactions").doc();
      if (voucher) {
        if (item.seller == voucher.seller_id) {
          // when item is the applied discount item
          if (voucher.percent) {
            //percentage discount
            var thisdiscount =
              (item.price * item.count * voucher.percentage_discount) / 100;
          } else {
            let count = 0;
            cart.forEach((item) => {
              if (item.seller == voucher.seller_id) {
                count = count + item.count;
              }
            });
            var thisdiscount = (voucher.amount_discount / count) * item.count;
          }
          console.log(thisdiscount);
          promises.push(
            ref
              .set({
                product_title: item.title,
                product_id: item.listingId,
                transaction_id: ref.id,
                shippedDate: null,
                shipping: currentShipping,
                buyer_name:
                  currentUser.first_name + " " + currentUser.last_name,
                seller_id: item.seller,
                store_name: item.store_name,
                store_logo: item.seller_logo,
                charge_id: charge_id,
                buyer_id: currentUser.uid,
                image: item.images[0],
                count: item.count,
                original_price: item.price,
                discount: Number(thisdiscount),
                paid: Number(item.price * item.count - thisdiscount),
                orderDate: timeNow,
                estimatedDeliveryTime: estimatedDeliveryTime,
                confirmedDeliveryTime: null,
                status: 3,
                groupbuy: false,
                voucher: voucher,
              })
              .then(() => {
                console.log(
                  "Successfully created " + item.title + " transaction"
                );
              })
              .catch((error) => {
                console.log(
                  "Failed to update " +
                    item.title +
                    " transaction in database : ",
                  error.message
                );
              })
          );
        } else {
          if (item.category == voucher.category || voucher.category == 0) {
            if (voucher.percent) {
              //percentage discount
              var thisdiscount =
                (item.price * item.count * voucher.percentage_discount) / 100;
            } else {
              let count = 0;
              if (voucher.category == 0) {
                count = countTotal;
              } else {
                cart.forEach((item) => {
                  if (item.category == voucher.category) {
                    count = count + item.count;
                  }
                });
              }

              var thisdiscount = (voucher.amount_discount / count) * item.count;
            }

            promises.push(
              ref
                .set({
                  product_title: item.title,
                  product_id: item.listingId,
                  transaction_id: ref.id,
                  shippedDate: null,
                  shipping: currentShipping,
                  buyer_name:
                    currentUser.first_name + " " + currentUser.last_name,
                  seller_id: item.seller,
                  store_name: item.store_name,
                  store_logo: item.seller_logo,
                  charge_id: charge_id,
                  buyer_id: currentUser.uid,
                  image: item.images[0],
                  count: item.count,
                  original_price: item.price,
                  discount: Number(thisdiscount),
                  paid: Number(item.price * item.count),
                  orderDate: timeNow,
                  estimatedDeliveryTime: estimatedDeliveryTime,
                  confirmedDeliveryTime: null,
                  status: 3,
                  groupbuy: false,
                  voucher: voucher,
                })
                .then(() => {
                  console.log(
                    "Successfully created " + item.title + " transaction"
                  );
                })
                .catch((error) => {
                  console.log(
                    "Failed to update " +
                      item.title +
                      " transaction in database : ",
                    error.message
                  );
                })
            );
          } else {
            promises.push(
              ref
                .set({
                  product_title: item.title,
                  product_id: item.listingId,
                  transaction_id: ref.id,
                  shippedDate: null,
                  shipping: currentShipping,
                  buyer_name:
                    currentUser.first_name + " " + currentUser.last_name,
                  seller_id: item.seller,
                  store_name: item.store_name,
                  store_logo: item.seller_logo,
                  charge_id: charge_id,
                  buyer_id: currentUser.uid,
                  image: item.images[0],
                  count: item.count,
                  original_price: item.price,
                  discount: Number(0),
                  paid: Number(item.price * item.count),
                  orderDate: timeNow,
                  estimatedDeliveryTime: estimatedDeliveryTime,
                  confirmedDeliveryTime: null,
                  status: 3,
                  groupbuy: false,
                  voucher: null,
                })
                .then(() => {
                  console.log(
                    "Successfully created " + item.title + " transaction"
                  );
                })
                .catch((error) => {
                  console.log(
                    "Failed to update " +
                      item.title +
                      " transaction in database : ",
                    error.message
                  );
                })
            );
          }
        }
      } else {
        promises.push(
          ref
            .set({
              product_title: item.title,
              product_id: item.listingId,
              transaction_id: ref.id,
              shippedDate: null,
              shipping: currentShipping,
              buyer_name: currentUser.first_name + " " + currentUser.last_name,
              seller_id: item.seller,
              store_name: item.store_name,
              store_logo: item.seller_logo,
              charge_id: charge_id,
              buyer_id: currentUser.uid,
              image: item.images[0],
              count: item.count,
              original_price: item.price,
              discount: Number(0),
              paid: Number(item.price * item.count),
              orderDate: timeNow,
              estimatedDeliveryTime: estimatedDeliveryTime,
              confirmedDeliveryTime: null,
              status: 3,
              groupbuy: false,
              voucher: null,
            })
            .then(() => {
              console.log(
                "Successfully created " + item.title + " transaction"
              );
            })
            .catch((error) => {
              console.log(
                "Failed to update " +
                  item.title +
                  " transaction in database : ",
                error.message
              );
            })
        );
      }
    });
    Promise.all(promises)
      .then(() => {
        if (voucher) {
          removeVoucher(currentTime);
        } else {
          navigation.navigate(routes.ORDERCONFIRMED, {
            currentShipping: currentShipping,
            deliveryTime: currentTime.toDateString(),
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  };

  const removeVoucher = (currentTime) => {
    if (currentUser.used_vouchers) {
      var used_vouchers = currentUser.used_vouchers;
      used_voucher.push(voucher.voucher_id);
    } else {
      var used_vouchers = [voucher.voucher_id];
    }
    if (currentUser.vouchers.length == 1) {
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          vouchers: null,
          used_vouchers: used_vouchers,
        })
        .then(() => {
          navigation.navigate(routes.ORDERCONFIRMED, {
            currentShipping: currentShipping,
            deliveryTime: currentTime.toDateString(),
          });
        })
        .catch((error) => {
          console.log(error.message);
          navigation.navigate(routes.ORDERCONFIRMED, {
            currentShipping: currentShipping,
            deliveryTime: currentTime.toDateString(),
          });
        });
    } else {
      var thisvouchers = currentUser.vouchers.filter(
        (x) => x != voucher.voucher_id
      );
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          vouchers: thisvouchers,
          used_vouchers: used_vouchers,
        })
        .then(() => {
          navigation.navigate(routes.ORDERCONFIRMED, {
            currentShipping: currentShipping,
            deliveryTime: currentTime.toDateString(),
          });
        })
        .catch((error) => {
          console.log(error.message);
          navigation.navigate(routes.ORDERCONFIRMED, {
            currentShipping: currentShipping,
            deliveryTime: currentTime.toDateString(),
          });
        });
    }
  };

  useEffect(() => {
    let totalDiscount = 0;
    setPayableTotal(orderTotal + 1.99);
    if (voucher) {
      cart.forEach((item) => {
        if (voucher.category) {
          if (item.category == voucher.category) {
            if (voucher.percent) {
              totalDiscount =
                totalDiscount +
                item.price * item.count * (voucher.percentage_discount / 100);
            } else {
              totalDiscount = totalDiscount + amount_discount;
            }
          }
        } else {
          if (item.seller == voucher.seller_id) {
            if (voucher.percent) {
              totalDiscount =
                totalDiscount +
                item.price * item.count * (voucher.percentage_discount / 100);
            } else {
              (totalDiscount) => totalDiscount + amount_discount;
            }
          }
        }
      });
      if (mounted.current) {
        setDiscountTotal(totalDiscount);
        setPayableTotal((payableTotal) => payableTotal - totalDiscount);
      }
    } else {
      if (mounted.current) {
        setDiscountTotal(totalDiscount);
      }
    }
  }, [voucher]);

  const selectVoucher = (voucher) => {
    setVoucher(voucher);
    setVoucherModalVisible(false);
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
        {/* Voucher Section */}
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <AddressListItem
            title='BuyFnE Vouchers'
            subTitle={
              voucher
                ? voucher.percent
                  ? voucher.percentage_discount + "% OFF"
                  : "$" + voucher.amount_discount + " OFF"
                : "Select"
            }
            IconComponent={
              <Icon
                name='ticket-percent'
                backgroundColor={colors.white}
                iconColor='black'
                size={30}
              />
            }
            onPress={() => {
              currentUser.vouchers == null
                ? Alert.alert(
                    "No Vouchers available",
                    "You do not have any vouchers. Add more in the Voucher section in your account page"
                  )
                : setVoucherModalVisible(true);
            }}
          />
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
              Shipping Subtotal
            </AppText>
            <AppText style={{ color: colors.muted, fontSize: 15 }}>
              $1.99
            </AppText>
          </View>
          {/* Voucher Discount total */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <AppText style={{ color: colors.muted, fontSize: 15 }}>
              Voucher Discount
            </AppText>
            <AppText style={{ color: colors.muted, fontSize: 15 }}>
              {voucher ? "-$" + discountTotal.toFixed(2) : "-$0.00"}
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
                      {"$" + item.price.toFixed(2)}
                    </AppText>
                  </View>
                  <View>
                    <AppText
                      style={{
                        color: colors.muted,
                        fontSize: 15,
                        marginBottom: 5,
                      }}
                      numberOfLines={1}
                    >
                      {"x" + item.count}
                    </AppText>
                  </View>
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
      {/* Modal for Voucher selection */}
      <Modal visible={voucherModalVisible} animationType='slide'>
        <Screen style={{ paddingTop: 0 }}>
          <Button title='Close' onPress={() => setVoucherModalVisible(false)} />
          <FlatList
            data={vouchers}
            keyExtractor={(item) => item.voucher_id}
            renderItem={({ item }) => (
              <CheckoutVoucherListItem
                item={item}
                onPress={() => item.apply && selectVoucher(item)}
              />
            )}
          />
        </Screen>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.whitegrey, paddingTop: 0 },
  image: { width: 80, height: 80, marginHorizontal: 10, marginVertical: 5 },
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

export default CheckoutScreen;
