import React, { useRef, useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AppText from "../components/AppText";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";

function ListingDetailsScreen({ route }) {
  // // Stack.Screen and part of navigation, has access to {route} to bring over parameters from previous page
  const listing = route.params;
  const scrollView = useRef();
  const [imageOnFocus, setImageOnFocus] = useState(listing.images[0]);
  const handlePress = (uri) => {
    setImageOnFocus(uri);
  };

  return (
    <View>
      {/* New Image component imported from react-native-expo-image-cache and uses new props*/}
      <Image style={styles.image} source={{ uri: imageOnFocus }} />

      <ScrollView
        ref={scrollView} // to tell scrollView that this is the instance component we are referencing
        horizontal={true} // to scroll horizontally
        onContentSizeChange={() => scrollView.current.scrollToEnd()} //When component changes size, execute an event,
        //scrollToEnd() is a method found in ScrollView documentation
      >
        <View style={styles.container}>
          {/* split array into individual images, view is used to give each image right margin */}
          {listing.images.map((uri) => (
            <View key={uri}>
              <TouchableWithoutFeedback onPress={() => handlePress(uri)}>
                <Image
                  style={styles.images}
                  key={uri} // unique identifier
                  source={{ uri: uri }}
                />
              </TouchableWithoutFeedback>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.detailsContainer}>
        <AppText style={styles.title}>{listing.title}</AppText>
        <AppText style={styles.price}>{"$" + listing.price}</AppText>
        <ListItem
          image={require("../assets/HnMlogo.png")}
          title='H&M'
          subTitle='5 Listings'
        />
      </View>
    </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  image: {
    width: "100%",
    height: 300,
  },
  images: {
    width: 70,
    height: 70,
    marginRight: 1,
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
