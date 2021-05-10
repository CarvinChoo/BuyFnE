import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
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
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as firebase from "firebase";
function PersonalGroupBuysScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);

  const [groupbuys, setGroupbuys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var groupbuys = []; // make a temp array to store groupbuys
    const promises = [];
    if (currentUser.inGroupBuys) {
      var ref = db.collection("users").doc(currentUser.uid);
      currentUser.inGroupBuys.forEach((groupbuyId) => {
        promises.push(
          db
            .collection("all_listings")
            .doc(groupbuyId)
            .get()
            .then((groupbuy) => {
              // push listing one by one into temp array
              if (groupbuy.exists) {
                if (
                  groupbuy.data().groupbuyId == null ||
                  (groupbuy.data().shoppers &&
                    !groupbuy.data().shoppers.includes(currentUser.uid))
                ) {
                  ref
                    .update({
                      inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                        groupbuy.data().listingId
                      ),
                    })
                    .then(() => {
                      console.log("Removed groupbuy");
                    })
                    .catch((e) => {
                      console.log("Failed to removed");
                    });
                } else if (
                  groupbuy.data().shoppers == null ||
                  groupbuy.data().shoppers.length < 1
                ) {
                  ref
                    .update({
                      inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                        groupbuy.data().listingId
                      ),
                    })
                    .then(() => {
                      console.log("Removed groupbuy");
                    })
                    .catch((e) => {
                      console.log("Failed to removed");
                    });
                } else {
                  groupbuys.push({
                    ...groupbuy.data(), // spread all properties of a listing document
                    key: groupbuy.id, // used by flatlist to identify each ListItem
                  });
                }
              } else {
                ref
                  .update({
                    inGroupBuys: firebase.firestore.FieldValue.arrayRemove(
                      groupbuyId
                    ),
                  })
                  .then(() => {
                    console.log("Removed groupbuy");
                  })
                  .catch((e) => {
                    console.log("Failed to removed");
                  });
              }
            })
            .catch((error) => {
              console.log("Error getting group buy info: ", error.message);
            })
        );
      });

      Promise.all(promises)
        .then(() => {
          setGroupbuys(groupbuys); //set groupbuys state to be replaced by temp array
          setLoading(false); // *********USED LATER TO SET LOADING SCREEN
        })
        .catch((error) => {
          console.log("Error getting group buy info: ", error.message);
          setLoading(false); // *********USED LATER TO SET LOADING SCREEN
        });
    } else {
      setGroupbuys(null);
      setLoading(false); // *********USED LATER TO SET LOADING SCREEN
    }
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
      {groupbuys.length > 0 ? (
        <FlatList
          style={{ paddingTop: 10 }}
          data={groupbuys}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 35 }}>
              {/* Section 1 */}
              <TouchableWithoutFeedback
                onPress={
                  () => navigation.navigate(routes.LISTING_DETAILS, item.key) //passes document id from all_listings collection
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    paddingHorizontal: 15,
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
                        Status:
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
                          textDecorationLine: "line-through",
                          textDecorationStyle: "solid",
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
                {/* Section 3 */}
                <View
                  style={{
                    padding: 10,
                    paddingHorizontal: 15,
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
                    Members:
                  </AppText>
                  <AppText
                    style={{
                      fontFamily: "sans-serif-condensed",
                      fontSize: 15,
                      color: colors.darkcyan,
                      marginLeft: 15,
                    }}
                  >
                    {item.currentOrderCount +
                      (item.currentOrderCount < item.minimumOrderCount &&
                        "/" + item.minimumOrderCount)}
                  </AppText>
                </View>

                {/*End of Entire View*/}
              </TouchableWithoutFeedback>
            </View>
          )}
        />
      ) : (
        <View
          style={{
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: "50%",
          }}
        >
          <AppText
            style={{ fontSize: 30, fontWeight: "bold", color: colors.grey }}
          >
            No Active Group Buys
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

export default PersonalGroupBuysScreen;
