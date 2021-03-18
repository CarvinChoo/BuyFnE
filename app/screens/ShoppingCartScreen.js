import React, { useContext, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Counter from "react-native-counters";

// BackEnd
import AuthApi from "../api/auth";
import AppButton from "../components/AppButton";

function ShoppingCartScreen(props) {
  const { cart, setCart } = useContext(AuthApi.AuthContext);
  const [order, setOrder] = useState(1);
  //Change order1 to item.count property for each item
  const onChange = (number, item) => {
    item.count = number;
    console.log(item);
    //item.count = number
  };
  const onDelete = (item) => {
    setCart((cart) => cart.filter((cartItem) => cartItem.key != item.key));
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
              <View style={{}}>
                <AppText numberOfLines={1}>{item.title}</AppText>
              </View>
              <View style={{ flexDirection: "row" }}>
                {/* If discount not applied
            <AppText>Price</AppText> */}
                <AppText
                  style={{
                    color: "red",
                    textDecorationLine: "line-through",
                    textDecorationStyle: "solid",
                  }}
                >
                  {"$" + item.price.toFixed(2)}
                </AppText>
                <AppText
                  style={{
                    marginLeft: 10,
                    color: colors.cyan,
                  }}
                >
                  {"$" +
                    (item.price - (item.price / 100) * item.discount).toFixed(
                      2
                    )}
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
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
                  //Change order to item.count
                  onChange={(number) => onChange(number, item)}
                />
                <TouchableHighlight
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    backgroundColor: colors.brightred,
                    borderRadius: 20,
                  }}
                  onPress={() => onDelete(item)}
                >
                  <AppText
                    style={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color: colors.white,
                    }}
                  >
                    Delete
                  </AppText>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        )}
      />
      <View style={{ backgroundColor: "white" }}>
        <AppButton
          icon='cash-usd'
          style={{ marginBottom: 10 }}
          title='Checkout'
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 100,
    height: 100,
  },
});

export default ShoppingCartScreen;
