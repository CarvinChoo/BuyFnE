import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableHighlight,
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

function ListingsHistoryScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = db
      .collection("all_listings")
      .where("seller", "==", currentUser.uid)
      .orderBy("createdAt", "desc") //order the listings by timestamp (createdAt)
      .onSnapshot((querySnapshot) => {
        //onSnapshot allows for updates if any changes are made from elsewhere
        const listings = []; // make a temp array to store listings

        querySnapshot.forEach((documentSnapshot) => {
          // push listing one by one into temp array
          listings.push({
            //(push as an object)
            ...documentSnapshot.data(), // spread all properties of a listing document
          });
        });

        setListings(listings); //set listings state to be replaced by temp array
        setLoading(false); // *********USED LATER TO SET LOADING SCREEN
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

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
      {listings ? (
        <FlatList
          style={{ paddingTop: 10 }}
          data={listings}
          keyExtractor={(item) => item.listingId}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 35 }}>
              {/* Section 1 */}
              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  backgroundColor: colors.white,
                }}
              >
                <View>
                  <Image
                    style={styles.image}
                    source={{ uri: item.images[0] }}
                  />
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
                        fontSize: 20,
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </AppText>
                  </View>
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
                      Status:
                    </AppText>
                    <AppText
                      style={{
                        fontFamily: "sans-serif-condensed",
                        fontSize: 15,
                        color: colors.darkcyan,
                        fontWeight: "bold",
                        marginLeft: 5,
                      }}
                    >
                      Available
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
                    <AppText
                      style={{
                        fontFamily: "sans-serif-light",
                        fontSize: 18,
                        color: colors.teal,
                        marginLeft: 10,
                      }}
                    >
                      {"( " +
                        "$" +
                        (
                          item.price -
                          (item.price / 100) * item.discount
                        ).toFixed(2) +
                        " )"}
                    </AppText>
                  </View>
                </View>
              </View>

              <ListItemSeperator />
              {/* Section 2 */}
              <View
                style={{
                  padding: 10,
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
              {/* Section 3 */}
              <View
                style={{
                  padding: 10,
                  backgroundColor: colors.white,
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
                  Stock Left:
                </AppText>
                <AppText
                  style={{
                    fontFamily: "sans-serif-condensed",
                    fontSize: 15,
                    color: colors.darkcyan,
                    marginLeft: 15,
                  }}
                >
                  {item.quantity + " items"}
                </AppText>
              </View>

              <ListItemSeperator />
              {/* Section 4 */}
              <View
                style={{
                  padding: 10,
                  backgroundColor: colors.white,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AppText
                    style={{
                      fontFamily: "sans-serif-condensed",
                      fontSize: 15,
                      color: colors.grey,
                    }}
                  >
                    Items Sold:
                  </AppText>
                  {/* !!!!!!!!!!!!! HARD CODED SOLD ITEMS */}
                  <AppText
                    style={{
                      fontFamily: "sans-serif-condensed",
                      fontSize: 15,
                      color: colors.grey,
                      marginLeft: 2,
                    }}
                  >
                    {" " + "20"}
                  </AppText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AppText
                    style={{
                      fontFamily: "sans-serif-condensed",
                      fontSize: 15,
                      color: colors.grey,
                    }}
                  >
                    Sales Total:
                  </AppText>
                  {/* !!!!!!!!!!!!! HARD CODED SALES TOTAL */}

                  <AppText
                    style={{
                      fontFamily: "sans-serif-condensed",
                      fontSize: 15,
                      fontWeight: "bold",
                      color: colors.pricered,
                      marginLeft: 2,
                    }}
                  >
                    {" " + "$20000.00"}
                  </AppText>
                </View>
              </View>

              <ListItemSeperator />
              {/* Section 5 */}
              <View>
                <View
                  style={{
                    padding: 10,
                    paddingBottom: 5,
                    backgroundColor: colors.white,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableHighlight
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 8,
                      backgroundColor: "#BF7636",
                      borderRadius: 10,
                    }}
                    onPress={() =>
                      navigation.navigate(routes.EDITLISTING, {
                        listingId: item.listingId,
                        title: item.title,
                        price: item.price,
                        discount: item.discount,
                        description: item.description,
                        minimumOrderCount: item.minimumOrderCount,
                        quantity: item.quantity,
                        timelimitDays: item.timelimitDays,
                        timelimitHours: item.timelimitHours,
                        timelimitMinutes: item.timelimitMinutes,
                        buylimit: item.buylimit,
                        category: item.category,
                      })
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
                        name='pencil'
                        size={15}
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
                        Edit this Listing
                      </AppText>
                    </View>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 8,
                      backgroundColor: colors.brightred,
                      borderRadius: 10,
                    }}
                    //onPress={() => onPause(item)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='pause'
                        size={15}
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
                        Pause Listing
                      </AppText>
                    </View>
                  </TouchableHighlight>
                </View>

                <View
                  style={{
                    padding: 10,
                    paddingTop: 5,
                    backgroundColor: colors.white,
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableHighlight
                    style={{
                      padding: 8,
                      backgroundColor: colors.brightred,
                      borderRadius: 10,
                    }}
                    //onPress={() => onDelete(item)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='close'
                        size={15}
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
                        Close
                      </AppText>
                    </View>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{
                      padding: 8,
                      backgroundColor: colors.teal,
                      borderRadius: 10,
                    }}
                    //onPress={() => onDelete(item)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='eye-outline'
                        size={15}
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
                        View Orders
                      </AppText>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>

              {/*End of Entire View*/}
            </View>
          )}
        />
      ) : (
        <AppText> You currently have no listings. Please add more.</AppText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 70,
    height: 70,
    overflow: "hidden",
  },
});

export default ListingsHistoryScreen;
