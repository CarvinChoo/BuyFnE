import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, ScrollView, Text, Alert } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import ReadMore from "react-native-read-more-text";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import ListItem from "../components/lists/ListItem";

// BackEnd
import AuthApi from "../api/auth";
import AppActivityIndicator from "../components/AppActivityIndicator";
import * as firebase from "firebase";
import db from "../api/db";

function ListingDetailsScreen({ route }) {
  // // Stack.Screen and part of navigation, has access to {route} to bring over parameters from previous page
  const all_listingId = route.params;
  const scrollView = useRef();
  const [imageOnFocus, setImageOnFocus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [groupbuy, setGroupBuy] = useState(null);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(0);
  const { cart, setCart, currentUser } = useContext(AuthApi.AuthContext);

  useEffect(() => {
    setLoading(true);
    var myIntervalRef;
    var GBsubscriber;
    const subscriber = db
      .collection("all_listings")
      .doc(all_listingId)
      .onSnapshot(
        (doc) => {
          setImageOnFocus(doc.data().images[0]);
          setListing({ ...doc.data(), key: all_listingId });
          //////// Initalized timer to maximum under assumption that there is no current group buy ////////////
          // If there is group buy active, timer will be set accordingly later //
          setSecond("00");
          setMinute(doc.data().timelimitMinutes);
          if (doc.data().timelimitHours < 10)
            setHour("0" + doc.data().timelimitHours);
          else setHour(doc.data().timelimitHours);
          ///////////////////////////////////////////////
          // Retreive group buy info and set timer
          if (doc.data().groupbuyId) {
            GBsubscriber = db
              .collection("all_groupbuys")
              .doc(doc.data().groupbuyId)
              .onSnapshot(
                (groupbuy) => {
                  console.log("GB");
                  //Check if groupbuyId provided has an existing groupbuy document
                  if (groupbuy.exists) {
                    setGroupBuy(groupbuy.data());
                    // subtract expiry time with current time
                    let timeleft =
                      groupbuy.data().timeEnd.toDate() -
                      firebase.firestore.Timestamp.now().toDate();
                    // removes trailing milliseconds
                    timeleft = Math.round(timeleft / 1000) * 1000;
                    // Calls interval that subtract 1 sec to the remaining time
                    myIntervalRef = setMyInterval(timeleft, groupbuy.data());
                  } else {
                    console.log("Group buy does not exist");
                    setLoading(false);
                  }
                },
                (error) => {
                  //Error catching for group buy query
                  console.log(error.message);
                  setLoading(false);
                }
              );
          }
          ///////////////////////////////

          // console.log("hello");
        },
        (error) => {
          // Error catching for listing query
          console.log(error.message);
          setLoading(false);
        }
      );

    return () => {
      clearInterval(myIntervalRef);
      GBsubscriber();
      subscriber();
    };
  }, []);

  // Group buy Countdown Timer
  const setMyInterval = (timeleft, groupbuydata) => {
    var timer = setInterval(function () {
      timeleft = timeleft - 1000;
      var date = new Date(timeleft);
      if (timeleft < 0) {
        console.log("STOPPED: ", timeleft);
        setHour("00");
        setMinute("00");
        setSecond("00");
        if (groupbuydata.currentOrderCount < groupbuydata.minimumOrderCount) {
          db.collection("all_groupbuys")
            .doc(groupbuydata.groupbuyId)
            .update({ status: "Unsuccessful" })
            .then(() => {
              console.log("Group buy failed");
            })
            .catch((error) => {
              console.log(error.message);
            });
        } else {
          db.collection("all_groupbuys")
            .doc(groupbuydata.groupbuyId)
            .update({ status: "Awaiting seller confirmation" })
            .then(() => {
              console.log("Awaiting seller confirmation");
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
        setLoading(false);
        clearInterval(timer);
      } else {
        console.log("Running: ", timeleft);
        if (date.getSeconds() < 10) setSecond("0" + date.getSeconds());
        else setSecond(date.getSeconds());
        setMinute(date.getMinutes());
        if (date.getHours() < 10) {
          setHour("0" + date.getHours());
        } else {
          setHour(date.getHours());
        }
        setLoading(false);
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
    // for (const i in cart) {
    //   console.log(listing.key);
    //   // if (i.key === listing.key) {
    //   //   i.count = i.count + 1;
    //   // } else {
    //   //   setCart((cart) => [...cart, listing]);
    //   // }
    // }
    // console.log(listing.key);
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
    const expIn = listing.timelimitHours * 3600 + listing.timelimitHours * 60;
    const timeNow = firebase.firestore.Timestamp.now();
    let createdAt = timeNow.toDate();
    createdAt.setSeconds(createdAt.getSeconds() + expIn);
    const timeExpireAt = firebase.firestore.Timestamp.fromDate(createdAt);

    const discountedPrice = (
      listing.price -
      (listing.price / 100) * listing.discount
    ).toFixed(2);
    const ref = db.collection("all_groupbuys").doc();

    ref
      .set({
        groupbuyId: ref.id,
        all_listingId: listing.key,
        seller_listingId: listing.listingID,
        sellerId: listing.seller,
        timelimitHours: listing.timelimitHours,
        timelimitMinutes: listing.timelimitHours,
        discountedPrice: discountedPrice,
        timeStart: timeNow,
        timeEnd: timeExpireAt,
        currentOrderCount: 1,
        minimumOrderCount: listing.minimumOrderCount,
        status: "Ongoing",
        shoppers: [currentUser.uid],
      })
      .then((doc) => {
        // setUserType(isEnabled ? 2 : 1); // set userType numeric 1 for Buyer and 2 for Seller
        console.log("GroupBuy Successfully Created.");
      })
      .catch((error) => {
        console.log("createGroup error:", error.message);
      });
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
          {listing && (
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
                      backgroundColor: groupbuy ? colors.green : colors.darkred,
                      paddingHorizontal: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 15,
                    }}
                  >
                    {groupbuy ? (
                      <AppText
                        style={{
                          fontSize: 18,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {groupbuy.status}
                      </AppText>
                    ) : (
                      <AppText
                        style={{
                          fontSize: 18,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Inactive
                      </AppText>
                    )}
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
                  <AppText
                    style={{
                      fontSize: 18,
                      color: "#ff3300",
                      fontFamily: "sans-serif-light",
                      fontWeight: "bold",
                    }}
                  >
                    Time Left: {hour}:{minute}:{second}
                  </AppText>
                  {groupbuy ? (
                    <AppText
                      style={{
                        fontSize: 18,
                        fontFamily: "sans-serif-condensed",
                        marginLeft: 10,
                      }}
                    >
                      {groupbuy.currentOrderCount}/{groupbuy.minimumOrderCount}{" "}
                      purchased
                    </AppText>
                  ) : (
                    <AppText
                      style={{
                        fontSize: 18,
                        fontFamily: "sans-serif-condensed",
                        marginLeft: 10,
                      }}
                    >
                      0/10 purchased
                    </AppText>
                  )}
                </View>
                {!groupbuy ? (
                  <AppButton
                    title='Create Group Buy'
                    icon='account-group'
                    onPress={createGroup}
                  />
                ) : groupbuy.shoppers.includes(currentUser.uid) ? (
                  <AppButton
                    color='darkgrey'
                    title='Already in this Group Buy'
                  />
                ) : (
                  <AppButton
                    title='Join Group Buy'
                    icon='account-group'
                    // onPress={createGroup}  ******change to join group buy function later
                  />
                )}
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
});
export default ListingDetailsScreen;
