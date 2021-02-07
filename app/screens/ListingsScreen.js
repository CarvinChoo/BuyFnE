import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Card from "../components/Card";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";

function ListingsScreen({ navigation }) {
  // since this is a Stack.Screen, it has access to {navigation} prop

  const [listings, setListings] = useState([]); // use for listing state
  const [error, setError] = useState(false); // used for error state

  useEffect(() => {
    loadListings(); // function to call listings
  }, []); // only call for listings once

  // function to call listings
  const loadListings = async () => {
    const response = await listingsApi.getListings(); // awaits for API layer to retreive and gives listings
    // Error handling
    if (!response.ok) {
      // if response returns an error
      setError(true); //set error state to true
      return;
    }
    setError(false); //means no error
    setListings(response.data); // set current state to listings received
  };

  return (
    <Screen style={styles.screen}>
      {error && ( // if error is detected
        <>
          <AppText>Couldn't retrieve the listings.</AppText>
          <AppButton
            title='Retry'
            onPress={loadListings} // button to reload listing request again
            color='cyan'
          />
        </>
      )}
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id.toString()} // unqiue key is alway expected to be a string
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={"$" + item.price}
            imageUrl={item.images[0].url} // due to listing having a array of images now, this will pick the 1st image's url
            onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)} //passing current {item} into ListingDetailsScreen
            //*routes.js is where you change the screen name
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,

    backgroundColor: colors.whitegrey,
  },
});

export default ListingsScreen;
