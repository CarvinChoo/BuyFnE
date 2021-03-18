import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Counter from "react-native-counters";
import AppButton from "../components/AppButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ShoppingCartScreen(props) {
  const [order, setOrder] = useState(1);
  //Change order1 to item.count property for each item
  const onChange = (number, type, order1) => {
    console.log(number, type); // 1, + or -
    console.log(order1);
    //item.count = number
  };
  const onDelete = () => {};
  return (
    <ScrollView style={{ backgroundColor: colors.whitegrey }}>
      {/* make sure there is a global state that saves cart info  */}

      {/* Have a FlatList here to iterate through all added items */}
      <Screen
        style={{
          marginBottom: 10,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            padding: 15,
            backgroundColor: colors.white,
            borderWidth: 1,
          }}
        >
          <View style={{ borderWidth: 1 }}>
            <Image
              style={styles.image}
              source={require("../assets/HermenLogo.png")}
            />
          </View>
          <View
            style={{
              borderWidth: 1,
              flexDirection: "column",
              marginLeft: 20,
              flex: 1,
            }}
          >
            <View style={{ borderWidth: 1 }}>
              <AppText numberOfLines={1}>Title</AppText>
            </View>
            <View style={{ borderWidth: 1, flexDirection: "row" }}>
              {/* If discount not applied
            <AppText>Price</AppText> */}
              <AppText
                style={{
                  color: "red",
                  textDecorationLine: "line-through",
                  textDecorationStyle: "solid",
                }}
              >
                Price
              </AppText>
              <AppText
                style={{
                  marginLeft: 5,
                  color: colors.cyan,
                }}
              >
                Discounted Price
              </AppText>
            </View>
            <View
              style={{
                borderWidth: 1,
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
                onChange={(number, type) => onChange(number, type, order)}
              />
              <TouchableHighlight
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                  backgroundColor: colors.brightred,
                  borderRadius: 20,
                }}
                onPress={onDelete}
              >
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: colors.white,
                  }}
                >
                  Delete
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Screen>
    </ScrollView>
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
