import React, { useContext, useDebugValue, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Alert,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  Modal,
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

//Navigation
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppButton from "../components/AppButton";
import { Error_Message } from "../components/forms";

//style properties of items on page
function CompleteScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [displayReview, setDisplayReview] = useState(null);

  // To set the default Star Selected
  const [currentRating, setCurrentRating] = useState(5);
  // To set the max number of Stars
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [review, setReview] = useState("");
  useEffect(() => {
    setLoading(true);
    const sub = db
      .collection("transactions")
      .where("buyer_id", "==", currentUser.uid)
      .where("status", "==", 5)
      .orderBy("orderDate", "desc")
      .onSnapshot(
        (transactions) => {
          const updatedOrders = [];
          transactions.forEach((transaction) => {
            updatedOrders.push(transaction.data());
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
  const retrieveReview = (item) => {
    db.collection("reviews")
      .doc(item.review_id)
      .get()
      .then((review) => {
        setDisplayReview(review.data());
        setModal2(true);
      });
  };
  const onSubmit = () => {
    console.log(review);
    if (review.length > 1) {
      setModal(false);
      setLoading(true);
      setError(null);
      db.collection("all_listings")
        .doc(item.product_id)
        .update({
          reviews: firebase.firestore.FieldValue.increment(1),
          rating: firebase.firestore.FieldValue.increment(currentRating),
        })
        .then(() => {
          const ref = db.collection("reviews").doc();
          ref
            .set({
              review_id: ref.id,
              author_id: currentUser.uid,
              author_name: currentUser.displayName,
              listingId: item.product_id,
              rating: Number(currentRating),
              content: review,
              transaction_id: item.transaction_id,
              date: firebase.firestore.Timestamp.now(),
            })
            .then(() => {
              db.collection("transactions")
                .doc(item.transaction_id)
                .update({
                  review_id: ref.id,
                })
                .then(() => {
                  setItem(null);
                  setReview("");
                  setCurrentRating(5);
                  Alert.alert("Review added", "Thank you for your review");
                })
                .catch((e) => {
                  setItem(null);
                  setReview("");
                  setCurrentRating(5);
                  console.log(e.message);
                  Alert.alert(
                    "Error occurred",
                    "Failed to update transaction review status."
                  );
                  setLoading(false);
                });
            })
            .catch((e) => {
              setItem(null);
              setReview("");
              setCurrentRating(5);
              console.log(e.message);
              Alert.alert(
                "Error occurred",
                "Failed to add review. Please try again later"
              );
              setLoading(false);
            });
        })
        .catch((e) => {
          setItem(null);
          setReview("");
          setCurrentRating(5);
          console.log(e.message);
          Alert.alert(
            "Error occurred",
            "Failed to add review. Please try again later"
          );
          setLoading(false);
        });
    } else {
      setError("Please type out a review");
    }
  };
  return (
    <>
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
                      estimatedDeliveryTime: null,
                      confirmedDeliveryTime: item.confirmedDeliveryTime
                        ? item.confirmedDeliveryTime.toDate().toDateString()
                        : null,
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
                {item.review_id ? (
                  <TouchableHighlight
                    style={{
                      padding: 8,
                      backgroundColor: colors.orange,
                      borderRadius: 10,
                    }}
                    onPress={() => retrieveReview(item)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <AppText
                        style={{
                          color: colors.white,
                          fontSize: 15,
                          fontWeight: "bold",
                          fontFamily: "sans-serif-medium",
                        }}
                      >
                        Reviewed
                      </AppText>
                    </View>
                  </TouchableHighlight>
                ) : (
                  <TouchableHighlight
                    style={{
                      padding: 8,
                      backgroundColor: colors.teal,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      setItem(item);
                      setModal(true);
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
                        name='pencil-plus'
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
                        Write a review
                      </AppText>
                    </View>
                  </TouchableHighlight>
                )}
              </View>
            </>
          )}
        />

        <Modal visible={modal} transparent={true}>
          <View style={styles.modal}>
            <View style={styles.modalBoxContainer}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Please rate the product
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                {maxRating.map((item, key) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={item}
                      onPress={() => setCurrentRating(item)}
                    >
                      {item <= currentRating ? (
                        <MaterialCommunityIcons
                          color={colors.goldenrod}
                          name='star'
                          size={40}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name='star-outline'
                          size={40}
                          color={colors.muted}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TextInput
                multiline
                numberOfLines={3}
                style={styles.textarea}
                placeholder='Leave a review (Max 150 characters)'
                MaxLength={150}
                onChangeText={(value) => setReview(value)}
              />
              <Error_Message visible={error} error={error} />
              <AppButton
                title='Submit Review'
                style={{ padding: 10, marginTop: 20 }}
                onPress={() => {
                  onSubmit();
                }}
              />
              <TouchableOpacity
                style={{ alignItems: "center", marginTop: 5 }}
                onPress={() => {
                  setItem(null);
                  setReview("");
                  setCurrentRating(5);
                  setModal(false);
                }}
              >
                <Text style={{ fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Modal for showing review */}
        <Modal visible={modal2} transparent={true}>
          {displayReview && (
            <View style={styles.modal}>
              <View style={styles.modalBoxContainer}>
                <View style={{ alignItems: "flex-end" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setDisplayReview(null);
                      setModal2(false);
                    }}
                  >
                    <MaterialCommunityIcons size={25} name='close' />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 17,
                  }}
                >
                  Rating:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {maxRating.map((item, key) => {
                    return item <= displayReview.rating ? (
                      <MaterialCommunityIcons
                        key={item}
                        color={colors.goldenrod}
                        name='star'
                        size={40}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        key={item}
                        name='star-outline'
                        size={40}
                        color={colors.muted}
                      />
                    );
                  })}
                </View>
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 17,

                    marginTop: 10,
                  }}
                >
                  Review:
                </Text>
                <Text
                  style={[
                    styles.textarea,
                    { marginTop: 5, fontWeight: "bold" },
                  ]}
                >
                  {displayReview.content}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    color: colors.muted,
                    textAlign: "right",
                  }}
                >
                  {displayReview.date.toDate().toDateString()}
                </Text>
              </View>
            </View>
          )}
        </Modal>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  //container properties
  container: {
    paddingTop: 0,
    backgroundColor: colors.whitegrey,
  },
  textarea: {
    padding: 10,
    fontSize: 15,
    backgroundColor: colors.whitegrey,
    borderRadius: 10,
    marginTop: 15,
  },
  customRatingBarStyle: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 30,
  },
  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
  },
  modalBoxContainer: {
    backgroundColor: colors.white,
    marginTop: "50%",
    borderRadius: 5,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
});

export default CompleteScreen;
