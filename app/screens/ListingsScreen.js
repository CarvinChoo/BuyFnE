import React from "react";
import { FlatList, StyleSheet } from "react-native";
import Card from "../components/Card";
import ListItemSeperator from "../components/lists/ListItemSeperator";

import Screen from "../components/Screen";
import colors from "../config/colors";

const listings = [
  {
    id: 1,
    title: "Red jacket for sale",
    price: "$" + 100,
    image: require("../assets/jacket.jpg"),
  },
  {
    id: 2,
    title: "Couch in great condition",
    price: "$" + 1000,
    image: require("../assets/couch.jpg"),
  },
];
function ListingsScreen({ navigation }) {
  // since this is a Stack.Screen, it has access to {navigation} prop
  return (
    <Screen style={styles.screen}>
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id.toString()} // unqiue key is alway expected to be a string
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={item.price}
            image={item.image}
            onPress={() => navigation.navigate("ListingDetails", item)} //passing current {item} into ListingDetailsScreen
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
