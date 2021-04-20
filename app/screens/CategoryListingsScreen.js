import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import ListingsCard from "../components/ListingsCard";

import routes from "../navigation/routes";
import Screen from "../components/Screen";
import colors from "../config/colors";

// Back End
import AuthApi from "../api/auth"; // for context
import db from "../api/db";

function CategoryListingsScreen({ route, navigation }) {
  // since this is a Stack.Screen, it has access to {navigation} prop
  const [category, setCategory] = useState(route.params.value);
  const [catlistings, setCatListings] = useState([]);
  const [loading, setLoading] = useState(true); //*********USED LATER TO SET LOADING SCREEN

  useEffect(() => {
    console.log("CategoryListings Mounted");
    db.collection("all_listings")
      .where("category", "==", category)
      .orderBy("createdAt", "desc") //order the listings by timestamp (createdAt)
      .get()
      .then((querySnapshot) => {
        //onSnapshot allows for updates if any changes are made from elsewhere
        const listings = []; // make a temp array to store listings

        querySnapshot.forEach((documentSnapshot) => {
          // push listing one by one into temp array
          listings.push({
            //(push as an object)
            ...documentSnapshot.data(), // spread all properties of a listing document
          });
        });
        console.log(listings);
        setCatListings(listings); //set listings state to be replaced by temp array
        setLoading(false); // *********USED LATER TO SET LOADING SCREEN
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false); // *********USED LATER TO SET LOADING SCREEN
      });

    // Unsubscribe from events when no longer in use
    return () => {
      console.log("CategoryListings unMounted");
    };
  }, []);
  return (
    <Screen style={styles.screen}>
      {/* Actual Search Bar  END*/}

      <FlatList
        data={catlistings}
        // Normally needed but we already added a "key" property to each listing (above)
        keyExtractor={(item) => item.listingId} // unqiue key is alway expected to be a string
        //!!!!!!!!! IMPLEMENT SEARCH BAR AND CATEGORIES HERE
        //ListHeaderComponent property for single render seperate components on the topp of flat list scrollable
        //https://stackoverflow.com/questions/60341135/react-native-separate-view-component-scrollable-with-flatlist
        renderItem={({ item }) => (
          <ListingsCard
            item={item}
            onPress={
              () => navigation.navigate(routes.LISTING_DETAILS, item.listingId) //passes document id from all_listings collection
            } //passing current {item} into ListingDetailsScreen
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
    backgroundColor: colors.whitegrey,
    paddingTop: 0,
    paddingBottom: 10,
  },
});

export default CategoryListingsScreen;
