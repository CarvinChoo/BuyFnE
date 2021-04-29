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
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function PersonalGroupBuysScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);

  const [groupbuys, setGroupbuys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var groupbuys = []; // make a temp array to store groupbuys
    const promises = [];
    if (currentUser.inGroupBuys) {
      currentUser.inGroupBuys.forEach((groupbuyId) => {
        let promise = db
          .collection("all_listings")
          .doc(groupbuyId)
          .get()
          .then((groupbuy) => {
            // push listing one by one into temp array
            groupbuys.push({
              ...groupbuy.data(), // spread all properties of a listing document
              key: groupbuy.id, // used by flatlist to identify each ListItem
            });
          })
          .catch((error) => {
            console.log("Error getting group buy info: ", error.message);
          });
        promises.push(promise);
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
      {groupbuys ? (
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
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <AppText style={{ fontFamily: "sans-serif-medium" }}>
            Currently not in any active group buys
          </AppText>
        </View>
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

export default PersonalGroupBuysScreen;
