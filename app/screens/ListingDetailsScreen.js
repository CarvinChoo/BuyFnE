import React from "react";
import { Image, View, StyleSheet } from "react-native";
import AppText from "../components/lists/AppText";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";

function ListingDetailsScreen(props) {
  return (
    <View>
      <Image style={styles.image} source={require("../assets/jacket.jpg")} />
      <View style={styles.detailsContainer}>
        <AppText style={styles.title}>Red Jacket for sale</AppText>
        <AppText style={styles.price}>$100</AppText>
        <ListItem
          image={require("../assets/HnMlogo.png")}
          title='H&M'
          subTitle='5 Listings'
        />
      </View>
    </View>
  );
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
