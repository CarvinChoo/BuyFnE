import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "react-native-expo-image-cache";
import AppText from "../components/AppText";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";

function ListingDetailsScreen({ route }) {
  // // Stack.Screen and part of navigation, has access to {route} to bring over parameters from previous page
  // const listing = route.params;

  // return (
  //   <View>
  //     {/* New Image component imported from react-native-expo-image-cache and uses new props*/}
  //     <Image
  //       style={styles.image}
  //       tint='light'
  //       preview={{ uri: listing.images[0].thumbnailUrl }}
  //       uri={listing.images[0].url}
  //     />
  //     <View style={styles.detailsContainer}>
  //       <AppText style={styles.title}>{listing.title}</AppText>
  //       <AppText style={styles.price}>{"$" + listing.price}</AppText>
  //       <ListItem
  //         image={require("../assets/HnMlogo.png")}
  //         title='H&M'
  //         subTitle='5 Listings'
  //       />
  //     </View>
  //   </View>
  // );
  return;
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
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
});
export default ListingDetailsScreen;
