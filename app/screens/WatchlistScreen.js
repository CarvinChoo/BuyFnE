import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../components/AppText";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Back End
import AuthApi from "../api/auth"; // for context
import db from "../api/db";
import AppActivityIndicator from "../components/AppActivityIndicator";
import routes from "../navigation/routes";
import * as firebase from "firebase";

function WatchlistScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    var watchlist = []; // make a temp array to store groupbuys
    const promises = [];
    if (currentUser.watchlist) {
      currentUser.watchlist.forEach((listing_id) => {
        promises.push(
          db
            .collection("all_listings")
            .doc(listing_id)
            .get()
            .then((listing) => {
              // push listing one by one into temp array

              watchlist.push({
                listingId: listing.data().listingId,
                title: listing.data().title,
                price: listing.data().price,
                discount: listing.data().discount,
                groupbuyId: listing.data().groupbuyId,
                groupbuyStatus: listing.data().groupbuyStatus,
                image: listing.data().images[0],
              });
            })
            .catch((error) => {
              console.log("Error getting watchlist info: ", error.message);
            })
        );
      });

      Promise.all(promises)
        .then(() => {
          setWatchlist(watchlist); //set groupbuys state to be replaced by temp array
          setLoading(false); // *********USED LATER TO SET LOADING SCREEN
        })
        .catch((error) => {
          console.log("Error getting watchlist info: ", error.message);
          Alert.alert("Error", "Error getting watchlist info");
          setLoading(false); // *********USED LATER TO SET LOADING SCREEN
        });
    } else {
      setLoading(false); // *********USED LATER TO SET LOADING SCREEN
    }
  }, [currentUser]);

  const removeFromWatchlist = (item) => {
    setLoading(true);
    if (currentUser.watchlist) {
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          watchlist: firebase.firestore.FieldValue.arrayRemove(item.listingId),
        })
        .then(() => {
          Alert.alert("Updated Watchlist", "Product removed from watchlist");
        })
        .catch((error) => {
          Alert.alert("Error", "Error updating watchlist");
          console.log("Error updating watchlist info: ", error.message);
          setLoading(true);
        });
    } else {
      Alert.alert("Error", "Error updating watchlist");
      setLoading(true);
    }
  };

  return (
    <Screen
      style={{
        backgroundColor: colors.whitegrey,
        paddingTop: 0,
      }}
    >
      <AppActivityIndicator // loading animation component
        visible={loading} // {loading} is a boolean state
      />
      {watchlist.length > 0 ? (
        <FlatList
          style={{ paddingTop: 10 }}
          data={watchlist}
          keyExtractor={(item) => item.listingId}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 35 }}>
              {/* Section 1 */}

              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  paddingHorizontal: 15,
                  backgroundColor: colors.white,
                }}
              >
                <View>
                  <Image style={styles.image} source={{ uri: item.image }} />
                </View>

                <View
                  style={{
                    // borderWidth: 1,
                    flexDirection: "column",
                    marginLeft: 20,
                    flex: 1,
                  }}
                >
                  <View
                    style={
                      {
                        // borderWidth: 1
                      }
                    }
                  >
                    <AppText
                      style={{
                        fontFamily: "sans-serif-medium",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </AppText>
                  </View>

                  {/* Status of Groupbuy */}
                  <View
                    style={{
                      // borderWidth: 1
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <AppText
                      style={{
                        fontFamily: "sans-serif-condensed",
                        fontSize: 15,
                        color: colors.grey,
                      }}
                    >
                      Group buy:
                    </AppText>
                    <AppText
                      style={{
                        fontFamily: "sans-serif-condensed",
                        fontSize: 15,
                        color:
                          item.groupbuyStatus == "Ongoing"
                            ? colors.mediumseagreen
                            : item.groupbuyStatus == "Unsuccessful"
                            ? colors.brown
                            : colors.darkgreen,
                        fontWeight: "bold",
                        marginLeft: 5,
                      }}
                    >
                      {item.groupbuyStatus}
                    </AppText>
                  </View>

                  <View
                    style={{
                      // borderWidth: 1,
                      flexDirection: "row-reverse",
                      alignItems: "center",
                    }}
                  >
                    {/* If discount not applied
      <AppText>Price</AppText> */}
                    <AppText
                      style={{
                        fontFamily: "sans-serif-light",
                        fontSize: 18,
                        color: colors.pricered,
                        marginLeft: 10,
                      }}
                    >
                      {"$" + item.price.toFixed(2)}
                    </AppText>
                  </View>
                </View>
              </View>

              <ListItemSeperator />
              {/* Section 2 */}
              <View
                style={{
                  padding: 10,
                  paddingHorizontal: 15,
                  backgroundColor: colors.white,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <AppText
                  style={{
                    fontFamily: "sans-serif-condensed",
                    fontSize: 15,
                    color: colors.grey,
                  }}
                >
                  Applicable Group Buy Discount:
                </AppText>
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
                      fontSize: 15,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {item.discount + "% OFF"}
                  </AppText>
                </View>
              </View>

              <ListItemSeperator />

              <View
                style={{
                  backgroundColor: colors.white,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  paddingHorizontal: 15,
                  marginBottom: 20,
                }}
              >
                <TouchableHighlight
                  style={{
                    padding: 8,
                    backgroundColor: colors.darkslategrey,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                  onPress={() =>
                    navigation.navigate(routes.LISTING_DETAILS, item.listingId)
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name='eye'
                      size={17}
                      color={colors.white}
                      style={{ marginRight: 5 }}
                    />
                    <AppText
                      style={{
                        color: colors.white,
                        fontSize: 15,
                        fontWeight: "bold",
                        fontFamily: "sans-serif-medium",
                      }}
                    >
                      Visit Product
                    </AppText>
                  </View>
                </TouchableHighlight>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.white,
                  }}
                  onPress={() => {
                    removeFromWatchlist(item);
                  }}
                >
                  <MaterialCommunityIcons
                    name='trash-can-outline'
                    size={25}
                    color={colors.grey}
                  />
                </TouchableOpacity>
              </View>
              {/*End of Entire View*/}
            </View>
          )}
        />
      ) : (
        <View
          style={{
            paddingHorizontal: 30,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: "50%",
          }}
        >
          <AppText
            style={{ fontSize: 30, fontWeight: "bold", color: colors.grey }}
          >
            Watchlist is empty.
          </AppText>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.black,
    overflow: "hidden",
    resizeMode: "contain",
  },
});

export default WatchlistScreen;
