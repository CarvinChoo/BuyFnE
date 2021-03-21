import React, { useContext, useRef, useState } from "react";
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

function ListingDetailsScreen({ route }) {
  // // Stack.Screen and part of navigation, has access to {route} to bring over parameters from previous page
  const listing = route.params;
  const scrollView = useRef();
  const [imageOnFocus, setImageOnFocus] = useState(listing.images[0]);
  const { cart, setCart } = useContext(AuthApi.AuthContext);
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

  const handleTextReady = () => {
    // ...
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
  return (
    //******* REMEMBER Listing document id is listing.key
    //********* TO BE USED WHEN ADDING TO CART
    <ScrollView style={{ backgroundColor: colors.whitegrey }}>
      <Screen
        style={{
          marginBottom: 10,
          paddingTop: 0,
        }}
      >
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
                backgroundColor: colors.darkred,
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
                Inactive
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
            <AppText
              style={{
                fontSize: 18,
                color: "#ff3300",
                fontFamily: "sans-serif-light",
                fontWeight: "bold",
              }}
            >
              Time Left: 24:00:00
            </AppText>
            <AppText
              style={{
                fontSize: 18,
                fontFamily: "sans-serif-condensed",
                marginLeft: 10,
              }}
            >
              0/10 purchased
            </AppText>
          </View>
          <AppButton title='Create Group Buy' icon='account-group' />
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
      </Screen>
    </ScrollView>
  );
  return;
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
