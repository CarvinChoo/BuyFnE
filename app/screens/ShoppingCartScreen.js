import React, { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Counter from "react-native-counters";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// BackEnd
import AuthApi from "../api/auth";
import AppButton from "../components/AppButton";
//Navigation
import routes from "../navigation/routes";

function ShoppingCartScreen({ navigation }) {
  const { cart, setCart } = useContext(AuthApi.AuthContext);

  //Change order1 to item.count property for each item
  const onChange = (number, item) => {
    item.count = number;
    console.log(item);
    //item.count = number
  };
  const onDelete = (item) => {
    setCart((cart) => cart.filter((cartItem) => cartItem.key != item.key)); //filter out cart item
  };
  return (
    //{/* make sure there is a global state that saves cart info  */}

    //{/* Have a FlatList here to iterate through all added items */}
    <Screen
      style={{
        backgroundColor: colors.whitegrey,
        marginBottom: 10,
        paddingTop: 0,
      }}
    >
      <FlatList
        style={{ paddingTop: 15 }}
        data={cart}
        renderItem={({ item }) => (
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              padding: 15,
              backgroundColor: colors.white,

              marginBottom: 15,
            }}
          >
            {/* Product Image */}
            <View style={{}}>
              <Image style={styles.image} source={{ uri: item.images[0] }} />
            </View>
            <View
              style={{
                flexDirection: "column",
                marginLeft: 20,
                flex: 1,
              }}
            >
              {/* Title */}
              <View style={{}}>
                <AppText
                  style={{
                    fontFamily: "sans-serif-medium",
                    fontWeight: "bold",
                  }}
                  numberOfLines={1}
                >
                  {item.title}
                </AppText>
              </View>

              {/* Price and Discount Section */}
              <View style={{ flexDirection: "row" }}>
                {/* If discount not applied
            <AppText>Price</AppText> */}
                <AppText
                  style={{
                    fontSize: 18,
                    color: "#ff3300",
                    fontFamily: "sans-serif-light",
                    fontWeight: "bold",
                    textDecorationLine: "line-through",
                    textDecorationStyle: "solid",
                  }}
                >
                  {"$" + item.price.toFixed(2)}
                </AppText>
                <AppText
                  style={{
                    marginLeft: 10,
                    fontSize: 18,
                    fontFamily: "sans-serif-light",
                    fontWeight: "bold",
                    color: "teal",
                  }}
                >
                  {"$" + item.discountedPrice}
                </AppText>
              </View>

              {/* Counter + Delete section */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* Add-minus counter */}
                <Counter
                  buttonStyle={{
                    borderColor: "#333",
                    borderWidth: 2,
                    borderRadius: 25,
                  }}
                  buttonTextStyle={{
                    color: "#333",
                  }}
                  countTextStyle={{
                    color: "#333",
                  }}
                  start={1}
                  min={1}
                  max={item.buylimit}
                  //Change order to item.count
                  onChange={(number) => onChange(number, item)}
                />

                {/* Delete from cart button */}
                <TouchableHighlight
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    backgroundColor: colors.brightred,
                    borderRadius: 20,
                  }}
                  onPress={() => onDelete(item)}
                >
                  <MaterialCommunityIcons
                    name='trash-can-outline'
                    size={20}
                    color={colors.white}
                  />
                </TouchableHighlight>
              </View>
            </View>
          </View>
        )}
      />
      <View style={{ backgroundColor: "white" }}>
        {/* Make sure to prevent onPress when cart is empty */}
        <AppButton
          icon='cash-usd'
          style={{ marginBottom: 10 }}
          title='Checkout'
          onPress={() => {
            cart.length > 0
              ? navigation.navigate(routes.CHECKOUT)
              : Alert.alert("Oh no", "The cart is empty");
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});

export default ShoppingCartScreen;
