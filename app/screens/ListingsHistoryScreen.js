import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import AppText from "../components/AppText";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ListingsHistoryScreen(props) {
  return (
    <Screen
      style={{
        backgroundColor: colors.whitegrey,
      }}
    >
      <View>
        {/* Section 1 */}
        <View
          style={{
            flexDirection: "row",
            padding: 15,
            backgroundColor: colors.white,
          }}
        >
          <View>
            <Image
              style={styles.image}
              source={require("../assets/jacket.jpg")}
            />
          </View>

          <View
            style={{
              // borderWidth: 1,
              flexDirection: "column",
              marginLeft: 20,
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <View
              style={
                {
                  // borderWidth: 1
                }
              }
            >
              <AppText numberOfLines={1}>Leather Red Jacket</AppText>
            </View>
            <View
              style={{
                // borderWidth: 1
                flexDirection: "row",
              }}
            >
              <AppText>Status: </AppText>
              <AppText style={{ color: "green" }}>Available</AppText>
            </View>
            <View
              style={{
                // borderWidth: 1,
                flexDirection: "row-reverse",
                alignContent: "center",
              }}
            >
              {/* If discount not applied
        <AppText>Price</AppText> */}
              <AppText
                style={{
                  fontSize: 15,
                  color: "red",
                  marginLeft: 10,
                }}
              >
                $100.00
              </AppText>
              <AppText
                style={{
                  fontSize: 15,
                  color: "cyan",
                  marginLeft: 10,
                }}
              >
                ( $80.50 )
              </AppText>
            </View>
          </View>
        </View>

        <ListItemSeperator />
        {/* Section 2 */}
        <View
          style={{
            padding: 15,
            backgroundColor: colors.white,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <AppText>Applicable Group Buy Discount:</AppText>
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
                fontSize: 18,
                color: "white",
                fontWeight: "bold",
              }}
            >
              30% OFF
            </AppText>
          </View>
        </View>

        <ListItemSeperator />
        {/* Section 3 */}
        <View
          style={{
            padding: 15,
            backgroundColor: colors.white,
            flexDirection: "row",
          }}
        >
          <AppText>Stock Left:</AppText>
          <AppText>{" " + "100"}</AppText>
        </View>

        <ListItemSeperator />
        {/* Section 4 */}
        <View
          style={{
            padding: 15,
            backgroundColor: colors.white,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <AppText>Items Sold:</AppText>
            <AppText>{" " + "20"}</AppText>
          </View>
          <View style={{ flexDirection: "row" }}>
            <AppText>Sales Total:</AppText>
            <AppText>{" " + "$20000.00"}</AppText>
          </View>
        </View>

        <ListItemSeperator />
        {/* Section 5 */}

        <View
          style={{
            padding: 15,
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
            // onPress={() => navigation.navgiate()}
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
                size={20}
                color={colors.white}
                style={{ marginRight: 5 }}
              />
              <AppText style={{ color: "white" }}>Edit this Listing</AppText>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 8,
              backgroundColor: colors.brightred,
              borderRadius: 20,
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
                name='pause'
                size={20}
                color={colors.white}
                style={{ marginRight: 5 }}
              />
              <AppText style={{ color: "white" }}>Pause Listing</AppText>
            </View>
          </TouchableHighlight>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            paddingBottom: 5,
            backgroundColor: colors.white,
            flexDirection: "row-reverse",
          }}
        >
          <TouchableHighlight
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
              backgroundColor: colors.brightred,
              borderRadius: 20,
            }}
            onPress={() => onDelete(item)}
          >
            <MaterialCommunityIcons
              name='close'
              size={20}
              color={colors.white}
            />
          </TouchableHighlight>
        </View>
        {/*End of Entire View*/}
      </View>
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
