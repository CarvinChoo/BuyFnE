import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Card from "../components/Card";

import routes from "../navigation/routes";
import Screen from "../components/Screen";
import colors from "../config/colors";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";

// Back End
import AuthApi from "../api/auth"; // for context
import db from "../api/db";

function ListingsScreen({ navigation }) {
  // since this is a Stack.Screen, it has access to {navigation} prop

  // const {
  //   data: listings, // alias for data
  //   error,
  //   loading,
  //   request: loadListings, // alias for request function
  // } = useApi(listingsApi.getListings);

  // useEffect(() => {
  //   loadListings(); // function to call listings
  // }, []); // only call for listings once
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true); //*********USED LATER TO SET LOADING SCREEN

  useEffect(() => {
    const subscriber = db
      .collection("all_listings")
      .orderBy("createdAt", "desc") //order the listings by timestamp (createdAt)
      .onSnapshot((querySnapshot) => {
        //onSnapshot allows for updates if any changes are made from elsewhere
        const listings = []; // make a temp array to store listings

        querySnapshot.forEach((documentSnapshot) => {
          // push listing one by one into temp array
          listings.push({
            //(push as an object)
            ...documentSnapshot.data(), // spread all properties of a listing document
            key: documentSnapshot.id, // used by flatlist to identify each ListItem
            count: 1,
          });
        });

        setListings(listings); //set listings state to be replaced by temp array
        setLoading(false); // *********USED LATER TO SET LOADING SCREEN
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  // const listings = [
  //   {
  //     id: 1,
  //     title: "Red jacket for sale",
  //     price: 100,
  //     image: require("../assets/jacket.jpg"),
  //   },
  //   {
  //     id: 2,
  //     title: "Couch in great condition",
  //     price: 1000,
  //     image: require("../assets/couch.jpg"),
  //   },
  // ];
  return (
    <Screen style={styles.screen}>
      {/* {error && ( // if error is detected
        <>
          <AppText>Couldn't retrieve the listings.</AppText>
          <AppButton
            title='Retry'
            onPress={loadListings} // button to reload listing request again
            color='cyan'
          />
        </>
      )}
      <AppActivityIndicator // loading animation component
        visible={loading} // {loading} is a boolean state
      /> */}
      <AppActivityIndicator // loading animation component
        visible={loading} // {loading} is a boolean state
      />
      <FlatList
        data={listings}
        // Normally needed but we already added a "key" property to each listing (above)
        // keyExtractor={(listing) => listing.key.toString()} // unqiue key is alway expected to be a string
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={"$" + item.price.toFixed(2)}
            discount={item.discount}
            quantity={item.quantity}
            image={item.images[0]} // pick the 1st element url from images array
            onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)} //passing current {item} into ListingDetailsScreen
            //********* WILL NEED TO PUT IN MORE PROPERTIES TO BE PASSED TO CARD
            //********* REMEMBER TO SET  ...otherProps in parameters in CARD component !!!!!!!!
            // imageUrl={item.images[0].url} // due to listing having a array of images now, this will pick the 1st image's url
            // image={item.image}
            // //*routes.js is where you change the screen name
            // // thumbnailUrl={item.images[0].thumbnailUrl} // sets thumbnail for progressive loading ( blur effect on image)
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: colors.whitegrey,
  },
});

export default ListingsScreen;
