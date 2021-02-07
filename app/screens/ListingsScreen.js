import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Card from "../components/Card";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import colors from "../config/colors";
import listingsApi from "../api/listings";

function ListingsScreen({ navigation }) {
  // since this is a Stack.Screen, it has access to {navigation} prop

  const [listings, setListings] = useState([]);

  useEffect(() => {
    loadListings(); // function to call listings
  }, []); // only call for listings once

  // function to call listings
  const loadListings = async () => {
    const response = await listingsApi.getListings(); // awaits for API layer to retreive and gives listings
    setListings(response.data); // set current state to listings received
  };

  return (
    <Screen style={styles.screen}>
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
