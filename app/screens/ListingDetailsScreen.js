import React, { useRef, useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import {
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import AppText from "../components/AppText";
import ListItem from "../components/lists/ListItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import ListingsScreen from "./ListingsScreen";
import AppButton from "../components/AppButton";

function ListingDetailsScreen({ route }) {
  // // Stack.Screen and part of navigation, has access to {route} to bring over parameters from previous page
  const listing = route.params;
  const scrollView = useRef();
  const [imageOnFocus, setImageOnFocus] = useState(listing.images[0]);
  const handlePress = (uri) => {
    setImageOnFocus(uri);
  };
  return (
    //Listing document id is listing.key
    <ScrollView style={{ backgroundColor: colors.whitegrey }}>
      <Screen
        style={{
          marginBottom: 10,
          paddingTop: 0,
        }}
      >
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

          <View
            style={{
              justifyContent: "center",
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: "white",
              marginBottom: 20,
            }}
          >
            <AppText
              style={{
                fontSize: 20,
                marginBottom: 10,
                fontWeight: "bold",
              }}
            >
              {listing.title}
            </AppText>
            <AppText
              style={{
                fontSize: 18,
                marginBottom: 10,
                color: "#ff3300",
              }}
            >
              {"$" + listing.price.toFixed(2)}
            </AppText>
            <AppText
              style={{
                fontSize: 18,
                marginBottom: 5,
                fontWeight: "bold",
              }}
            >
              10 Reviews | 20 Sold
            </AppText>
          </View>
          <View
            style={{
              justifyContent: "center",

              paddingVertical: 5,
              backgroundColor: "white",
            }}
          >
            <AppText
              style={{
                fontSize: 20,
                paddingHorizontal: 10,
                marginBottom: 15,
                fontWeight: "bold",
              }}
            >
              Group Buy
            </AppText>
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
                  textDecorationLine: "line-through",
                  textDecorationStyle: "solid",
                }}
              >
                {"$" + listing.price.toFixed(2)}
              </AppText>
              <AppText
                style={{
                  fontSize: 18,
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
              <View style={{ alignItems: "center", justifyContent: "center" }}>
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
            </View>
            <AppButton title='Create Group Buy' icon='account-group' />
          </View>
          {/* <View style={{ flexDirection: "row" }}>
            <AppText style={[styles.gbPrice, { color: "teal" }]}>
              {"Group Buy Price: "}
            </AppText>
            <AppText style={[styles.gbPrice, styles.strikeThrough]}>
              {"$" + listing.price}
            </AppText>
            <AppText style={[styles.gbPrice, { color: "green" }]}>
              {" $" +
                (
                  listing.price -
                  (listing.price / 100) * listing.discount
                ).toFixed(2)}
            </AppText>
            <View
              style={{
                width: 60,
                backgroundColor: "green",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <AppText
                style={{
                  color: "white",
                  fontSize: 15,
                }}
              >
                {listing.discount}% off
              </AppText>
            </View>
          </View> */}
          {/* <ListItem
            image={require("../assets/HnMlogo.png")}
            title='H&M'
            subTitle='5 Listings'
          /> */}
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
