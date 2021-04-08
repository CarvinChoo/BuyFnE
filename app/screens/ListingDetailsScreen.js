import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, ScrollView, Text, Alert } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import ReadMore from "react-native-read-more-text";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import ListItem from "../components/lists/ListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// BackEnd
import AuthApi from "../api/auth";
import AppActivityIndicator from "../components/AppActivityIndicator";
import * as firebase from "firebase";
import db from "../api/db";

function ListingDetailsScreen({ route }) {
  // // Stack.Screen and part of navigation, has access to {route} to bring over parameters from previous page
  const all_listingId = route.params;
  const scrollView = useRef();
  const isMounted = useRef(true);
  const [imageOnFocus, setImageOnFocus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [day, setDay] = useState(0);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(0);
  const { cart, setCart, currentUser } = useContext(AuthApi.AuthContext);
  useEffect(() => {
    console.log("Product Mounted");
    setLoading(true);
    var myIntervalRef;
    const subscriber = db
      .collection("all_listings")
      .doc(all_listingId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            if (isMounted.current) {
              setImageOnFocus(doc.data().images[0]);
              setListing({ ...doc.data(), key: all_listingId });
              //////// Initalized timer to maximum under assumption that there is no current group buy ////////////
              // If there is group buy active, timer will be set accordingly later //
              setDay(doc.data().timelimitDays);
              setSecond("00");
              if (doc.data().timelimitMinutes < 10)
                setMinute("0" + doc.data().timelimitMinutes);
              else setMinute(doc.data().timelimitMinutes);
              if (doc.data().timelimitHours < 10)
                setHour("0" + doc.data().timelimitHours);
              else setHour(doc.data().timelimitHours);
              ///////////////////////////////////////////////
              // Retreive group buy info and set timer
              if (doc.data().groupbuyId) {
                console.log("GB");
                // subtract expiry time with current time
                let timeleft =
                  doc.data().timeEnd.toDate() -
                  firebase.firestore.Timestamp.now().toDate();
                // removes trailing milliseconds
                timeleft = Math.round(timeleft / 1000) * 1000;
                // Calls interval that subtract 1 sec to the remaining time
                myIntervalRef = setMyInterval(timeleft, doc.data());
              } else {
                console.log("No ongoing groupbuy");
                setLoading(false);
              }
              ///////////////////////////////
            } else {
              console.log("Listing has been deleted");
              setLoading(false);
            }
          }
        },
        (error) => {
          // Error catching for listing query
          console.log(error.message);
          setLoading(false);
        }
      );

    return () => {
      isMounted.current = false;
      clearInterval(myIntervalRef);
      subscriber();
      console.log("Product Unmounted");
    };
  }, []);

  // Group buy Countdown Timer
  const setMyInterval = (timeleft, groupbuydata) => {
    var timer = setInterval(function () {
      timeleft = timeleft - 1000;
      var date = new Date(timeleft);
      if (isMounted.current) {
        if (timeleft < 0) {
          console.log("STOPPED: ", timeleft);
          if (isMounted.current) {
            setDay("0");
            setHour("00");
            setMinute("00");
            setSecond("00");
          }
          if (groupbuydata.groupbuyStatus == "Ongoing") {
            if (
              groupbuydata.currentOrderCount < groupbuydata.minimumOrderCount
            ) {
              db.collection("all_listings")
                .doc(groupbuydata.groupbuyId)
                .update({ groupbuyStatus: "Unsuccessful" })
                .then(() => {
                  console.log("Group buy failed");
                })
                .catch((error) => {
                  console.log(error.message);
                });
            } else {
              db.collection("all_listings")
                .doc(groupbuydata.groupbuyId)
                .update({ groupbuyStatus: "Awaiting seller confirmation" })
                .then(() => {
                  console.log("Awaiting seller confirmation");
                })
                .catch((error) => {
                  console.log(error.message);
                });
            }
          }
          setLoading(false);
          clearInterval(timer);
        } else {
          console.log("Running: ", timeleft);
          if (isMounted.current) {
            var Difference_In_Days = Math.round(timeleft / (1000 * 3600 * 24));
            setDay(Difference_In_Days);
            if (date.getSeconds() < 10) setSecond("0" + date.getSeconds());
            else setSecond(date.getSeconds());
            if (date.getMinutes() < 10) setMinute("0" + date.getMinutes());
            else setMinute(date.getMinutes());

            if (date.getHours() < 10) setHour("0" + date.getHours());
            else setHour(date.getHours());
            setLoading(false);
          }
        }
      } else {
        clearInterval(timer);
      }
    }, 1000);
    return timer;
  };

  // Function to alternate image that is in focus
  const handlePress = (uri) => {
    setImageOnFocus(uri);
  };
  // Function to render Read More Button
  const renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={{ fontSize: 16, color: "teal", marginTop: 5 }}
        onPress={handlePress}
      >
        Read more
      </Text>
    );
  };
  // Function to render Show Less Button
  const renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={{ fontSize: 16, color: "teal", marginTop: 5 }}
        onPress={handlePress}
      >
        Show less
      </Text>
    );
  };

  const addToCart = (listing) => {
    var similar = false;
    if (cart.length > 0) {
      cart.forEach((item) => {
        if (item.key == listing.key) similar = true;
      });
      if (similar == true) alert("Item is already in Shopping Cart.");
      else setCart((cart) => [...cart, listing]);
      alert("Add item to cart.");
    } else {
      setCart((cart) => [...cart, listing]);
      alert("Add item to cart.");
    }
    console.log(cart);
  };

  // Function for readmore **Dont delete, it just need to exist
  const handleTextReady = () => {
    // ...
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

    db.collection("all_listings") // updating global listings
      .doc(listing.listingId) // listingId and groupbuyId is the same id
      .update({
        groupbuyId: listing.listingId,
        timeStart: timeNow,
        timeEnd: timeExpireAt,
        currentOrderCount: 1,
        groupbuyStatus: "Ongoing",
        shoppers: [currentUser.uid],
      })
      .then(() => {
        db.collection("listings") // updating a personal copy of seller's own listing
          .doc(listing.seller)
          .collection("my_listings")
          .doc(listing.listingId)
          .update({
            groupbuyId: listing.listingId,
            timeStart: timeNow,
            timeEnd: timeExpireAt,
            currentOrderCount: 1,
            groupbuyStatus: "Ongoing",
            shoppers: [currentUser.uid],
          })
          .then(() => {
            console.log("GroupBuy Successfully Created.");
          })
          .catch((error) => {
            console.log(
              "Updating seller's personal group buy order copy error: ",
              error.message
            );
          });
      })
      .catch(() => {
        console.log("Updating groupbuy information in all_listings error.");
      });
  };

  const joinGroup = () => {
    if (listing.groupbuyId) {
      //Updates groupbuy info with new member uid and increment order count by 1
      db.collection("all_listings")
        .doc(listing.groupbuyId)
        .update({
          shoppers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
          currentOrderCount: firebase.firestore.FieldValue.increment(1),
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
                  })
                  .catch((error) => {
                    console.log("Retreiving user info error", error.message);
                  });
              }
            })
            .catch((error) => {
              console.log("Retreiving user info error", error.message);
            });
        })
        .catch((error) => {
          console.log("Updating group buy member error :", error.message);
        });
    } else console.log("Group buy id is null. May have been deleted");
  };

  return (
    //******* REMEMBER Listing document id is listing.key
    //********* TO BE USED WHEN ADDING TO CART
    <>
      <AppActivityIndicator // loading animation component
        visible={loading} // {loading} is a boolean state
      />
      <ScrollView style={{ backgroundColor: colors.whitegrey }}>
        <Screen
          style={{
            marginBottom: 10,
            paddingTop: 0,
          }}
        >
          {listing ? (
            <View>
              {/* New Image component imported from react-native-expo-image-cache and uses new props*/}
              <Image style={styles.image} source={{ uri: imageOnFocus }} />
              <ScrollView
                ref={scrollView} // to tell scrollView that this is the instance component we are referencing
                horizontal={true} // to scroll horizontally
                onContentSizeChange={() => scrollView.current.scrollToEnd()} //When component changes size, execute an event,
                //scrollToEnd() is a method found in ScrollView documentation
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  {/* split array into individual images, view is used to give each image right margin */}
                  {listing.images.map((uri) => (
                    <View
                      key={uri}
                      style={{ marginHorizontal: 1, overflow: "scroll" }}
                    >
                      <TouchableHighlight onPress={() => handlePress(uri)}>
                        <Image
                          style={styles.images}
                          key={uri} // unique identifier
                          source={{ uri: uri }}
                        />
                      </TouchableHighlight>
                    </View>
                  ))}
                </View>
              </ScrollView>
              {/* Title, Price Section */}
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: "white",
                }}
              >
                <AppText
                  style={{
                    fontSize: 20,
                    marginBottom: 10,
                    fontFamily: "sans-serif-medium",
                    fontWeight: "bold",
                  }}
                >
                  {listing.title}
                </AppText>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 18,
                      color: "#ff3300",
                      fontFamily: "sans-serif-light",
                      fontWeight: "bold",
                    }}
                  >
                    {"$" + listing.price.toFixed(2)}
                  </AppText>
                  <AppText
                    style={{
                      fontSize: 18,
                      color: "black",
                      fontFamily: "sans-serif-condensed",
                      fontWeight: "bold",
                    }}
                  >
                    {"Stock: " + listing.quantity}
                  </AppText>
                </View>
                <AppText
                  style={{
                    fontSize: 18,
                    marginBottom: 5,
                    fontWeight: "bold",
                    fontFamily: "sans-serif-condensed",
                    fontWeight: "bold",
                  }}
                >
                  10 Reviews | 20 Sold
                </AppText>
              </View>
              <ListItemSeperator />
              {/*!!!!!!!!!!!!!!!!!! Hard coded Seller Info */}
              <ListItem
                style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                image={require("../assets/HermenLogo.png")}
                title='Hermen Miller Inc.'
                subTitle='Products: 15'
                border={true}
              />
              <ListItemSeperator />
              {/* Description Section */}
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: "white",
                }}
              >
                <AppText
                  style={{
                    fontSize: 20,
                    marginBottom: 10,
                    fontWeight: "bold",
                  }}
                >
                  Description
                </AppText>
                <View style={{ marginBottom: 10 }}>
                  <ReadMore
                    numberOfLines={3}
                    renderTruncatedFooter={renderTruncatedFooter}
                    renderRevealedFooter={renderRevealedFooter}
                    onReady={handleTextReady}
                  >
                    <AppText
                      style={{
                        fontSize: 18,
                        fontFamily: "sans-serif-thin",
                        fontWeight: "bold",
                      }}
                    >
                      {listing.description ? listing.description : "N.A"}
                    </AppText>
                  </ReadMore>
                </View>
              </View>
              {/* Add to Cart Button */}
              <View
                style={{
                  // flex: 1,
                  // justifyContent: "center",
                  // alignItems: "center",
                  flexDirection: "row",
                  marginVertical: 5,
                  overflow: "hidden",
                  justifyContent: "space-around",
                }}
              >
                <AppButton
                  icon='cart-arrow-down'
                  color='cyan'
                  title='Add to Cart'
                  style={{ width: "48%" }}
                  onPress={() => addToCart(listing)}
                />
                <AppButton
                  icon='clipboard-list'
                  color='darkslategrey'
                  title='Watchlist It'
                  style={{ width: "48%" }}
                />
              </View>
              {/* Group Buy Section */}
              <View
                style={{
                  justifyContent: "center",
                  paddingVertical: 5,
                  backgroundColor: "white",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 15,
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 20,
                      paddingHorizontal: 10,

                      fontWeight: "bold",
                    }}
                  >
                    Group Buy
                  </AppText>
                  <View
                    style={{
                      backgroundColor: listing.groupbuyId
                        ? colors.green
                        : colors.darkred,
                      paddingHorizontal: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 15,
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {listing.groupbuyId ? listing.groupbuyStatus : "Inactive"}
                    </AppText>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    marginBottom: 15,
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 18,
                      color: "#ff3300",
                      fontFamily: "sans-serif-light",
                      fontWeight: "bold",
                      textDecorationLine: "line-through",
                      textDecorationStyle: "solid",
                    }}
                  >
                    {"$" + listing.price.toFixed(2)}
                  </AppText>
                  <AppText
                    style={{
                      fontSize: 18,
                      fontFamily: "sans-serif-light",
                      fontWeight: "bold",
                      color: "green",
                      marginLeft: 10,
                    }}
                  >
                    {"$" +
                      (
                        listing.price -
                        (listing.price / 100) * listing.discount
                      ).toFixed(2)}
                  </AppText>

                  <View
                    style={{
                      backgroundColor: "teal",
                      paddingHorizontal: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 10,
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {listing.discount + "% OFF"}
                    </AppText>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    marginBottom: 15,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name='clock-outline'
                      size={18}
                      color='#ff3300'
                      style={{ marginRight: 5 }}
                    />
                    <AppText
                      style={{
                        fontSize: 18,
                        color: "#ff3300",
                        fontFamily: "sans-serif-light",
                        fontWeight: "bold",
                      }}
                    >
                      {day} day {hour}:{minute}:{second}
                    </AppText>
                  </View>
                  {listing.groupbuyId ? (
                    <AppText
                      style={{
                        fontSize: 18,
                        fontFamily: "sans-serif-condensed",
                        marginLeft: 10,
                      }}
                    >
                      {listing.currentOrderCount}/{listing.minimumOrderCount}{" "}
                      purchased
                    </AppText>
                  ) : (
                    <AppText a>0/{listing.minimumOrderCount} purchased</AppText>
                  )}
                </View>
                {currentUser &&
                  currentUser.uid != listing.seller &&
                  (listing.groupbuyId ? (
                    listing.shoppers.includes(currentUser.uid) ? (
                      <AppButton
                        color='darkgrey'
                        title='Already in this Group Buy'
                      />
                    ) : (
                      <AppButton
                        title='Join Group Buy'
                        icon='account-group'
                        onPress={joinGroup}
                      />
                    )
                  ) : (
                    <AppButton
                      title='Create Group Buy'
                      icon='account-group'
                      onPress={createGroup}
                    />
                  ))}
              </View>
              <ListItemSeperator />
              {/* Timed Based Milestones for Group Buy */}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 5,
                  backgroundColor: "white",
                  marginBottom: 20,
                  paddingVertical: 50,
                }}
              >
                <AppText>Timed Based Milestones for Group Buy</AppText>
              </View>
            </View>
          ) : (
            <AppText>Listing has been deleted.</AppText>
          )}
        </Screen>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    borderWidth: 1,
    borderColor: "white",
  },
  detailsContainer: {
    paddingLeft: 10,
    paddingTop: 5,
  },
  image: {
    width: "100%",
    height: 250,
  },
  images: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  price: {
    color: colors.cyan,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  gbPrice: {
    color: "red",
    fontSize: 15,
    fontWeight: "bold",
  },
  strikeThrough: {
    color: "red",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  timer: {
    fontSize: 18,
    color: "#ff3300",
    fontFamily: "sans-serif-light",
    fontWeight: "bold",
  },
});
export default ListingDetailsScreen;
