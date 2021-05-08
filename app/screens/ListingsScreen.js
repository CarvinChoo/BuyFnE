import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import ListingsCard from "../components/ListingsCard";

import routes from "../navigation/routes";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppFormPickerCat from "../components/AppFormPickerCat";
import AppActivityIndicator from "../components/AppActivityIndicator";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";

// Back End
import AuthApi from "../api/auth"; // for context
import db from "../api/db";
import Icon from "../components/Icon";

const categories = [
  {
    label: "Furniture",
    value: 1,
    backgroundColor: "saddlebrown",
    icon: "table-furniture",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Clothing",
    value: 2,
    backgroundColor: "palevioletred",
    icon: "shoe-formal",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Food",
    value: 3,
    backgroundColor: "orange",
    icon: "food-fork-drink",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Games",
    value: 4,
    backgroundColor: "green",
    icon: "games",
    IconType: MaterialIcons,
  },
  {
    label: "Computer",
    value: 5,
    backgroundColor: colors.muted,
    icon: "computer",
    IconType: MaterialIcons,
  },
  {
    label: "Health",
    value: 6,
    backgroundColor: "red",
    icon: "heart-plus",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Books",
    value: 7,
    backgroundColor: "maroon",
    icon: "bookshelf",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Electronic",
    value: 8,
    backgroundColor: "skyblue",
    icon: "electrical-services",
    IconType: MaterialIcons,
  },
  {
    label: "Others",
    value: 9,
    backgroundColor: "blue",
    icon: "devices-other",
    IconType: MaterialIcons,
  },
];
function ListingsScreen({ navigation }) {
  // since this is a Stack.Screen, it has access to {navigation} prop
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true); //*********USED LATER TO SET LOADING SCREEN
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("Listings Mounted");
    const subscriber = db
      .collection("all_listings")
      .where("listingStatus", "==", "Active")
      .orderBy("createdAt", "desc") //order the listings by timestamp (createdAt)
      .onSnapshot(
        (querySnapshot) => {
          //onSnapshot allows for updates if any changes are made from elsewhere
          const listings = []; // make a temp array to store listings

          querySnapshot.forEach((documentSnapshot) => {
            // push listing one by one into temp array
            listings.push({
              //(push as an object)
              listingId: documentSnapshot.data().listingId,
              title: documentSnapshot.data().title,
              description: documentSnapshot.data().description,
              store_name: documentSnapshot.data().store_name,
              price: documentSnapshot.data().price,
              image: documentSnapshot.data().images[0],
              groupbuyId: documentSnapshot.data().groupbuyId,
              discountedPrice: documentSnapshot.data().discountedPrice,
              discount: documentSnapshot.data().discount,
              groupbuyStatus: documentSnapshot.data().groupbuyStatus,
              currentOrderCount: documentSnapshot.data().currentOrderCount,
              minimumOrderCount: documentSnapshot.data().minimumOrderCount,
              quantity: documentSnapshot.data().quantity,
              rating: documentSnapshot.data().rating,
              reviews: documentSnapshot.data().reviews,
            });
          });
          setAllListings(listings);
          setListings(listings); //set listings state to be replaced by temp array

          setLoading(false); // *********USED LATER TO SET LOADING SCREEN
        },
        (error) => {
          console.log(error.message);
          setLoading(false); // *********USED LATER TO SET LOADING SCREEN
        }
      );

    // Unsubscribe from events when no longer in use
    return () => {
      console.log("Listings unMounted");
      subscriber();
    };
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
    // setListings(() => {

    // });
    var found = allListings.filter((product) => {
      return (
        product.description.toUpperCase().includes(search.toUpperCase()) ||
        product.title.toUpperCase().includes(search.toUpperCase()) ||
        product.store_name.toUpperCase().includes(search.toUpperCase())
      );
    });
    setListings(found);
  };

  return (
    <>
      <StatusBar backgroundColor={colors.brightred} />
      <Screen style={styles.screen}>
        <AppActivityIndicator // loading animation component
          visible={loading} // {loading} is a boolean state
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: colors.brightred,
          }}
        >
          <Image
            source={require("../assets/BuyFnELogo-3.png")}
            style={{
              width: 90,
              height: 40,
              marginLeft: 10,
            }}
          />

          {!currentUser && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate(routes.WELCOME)}
              >
                <AppText
                  style={{
                    color: colors.white,
                    fontSize: 16,
                    fontWeight: "bold",
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                  }}
                >
                  Login / Register
                </AppText>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
        {/* !!!!!!!! Hard Coded Search Bar + category */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.brightred,
            paddingTop: 5,
            paddingBottom: 10,
            paddingHorizontal: 5,
          }}
        >
          {/*  Category */}
          <AppFormPickerCat
            items={categories}
            numOfColumns={3}
            navigation={navigation}
          />
          {/*  Category END */}

          {/* Actual Search Bar */}

          <SearchBar
            containerStyle={{
              flex: 1,
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
            }}
            placeholder='Search'
            placeholderTextColor={colors.muted}
            platform='android'
            onChangeText={updateSearch}
            value={search}
          />
        </View>

        {/* Actual Search Bar  END*/}
        <View
          style={{
            backgroundColor: colors.whitegrey,
            flex: 1,
          }}
        >
          <FlatList
            data={listings}
            // Normally needed but we already added a "key" property to each listing (above)
            keyExtractor={(item) => item.listingId} // unqiue key is alway expected to be a string
            //!!!!!!!!! IMPLEMENT SEARCH BAR AND CATEGORIES HERE
            //ListHeaderComponent property for single render seperate components on the topp of flat list scrollable
            //https://stackoverflow.com/questions/60341135/react-native-separate-view-component-scrollable-with-flatlist
            renderItem={({ item }) => (
              <ListingsCard
                item={item}
                onPress={
                  () =>
                    navigation.navigate(routes.LISTING_DETAILS, item.listingId) //passes document id from all_listings collection
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
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.whitegrey,
    paddingTop: 0,
  },
});

export default ListingsScreen;
