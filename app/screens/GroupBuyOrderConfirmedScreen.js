import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Button, FlatList } from "react-native";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import colors from "../config/colors";
import Screen from "../components/Screen";

// BackEnd
import AuthApi from "../api/auth";

import Icon from "../components/Icon";

function OrderConfirmedScreen({ route, navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const deliveryInfo = route.params.currentShipping;
  const cart = route.params.cart;

  const renderHeader = () => {
    return (
      <>
        <View style={styles.view2}>
          <Text style={styles.text}>Thank you for your Order</Text>
        </View>

        <ListItemSeperator />
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <View style={{ backgroundColor: colors.white }}>
          {/*view to insert buyer name  */}
          <View style={styles.view2}>
            <Text style={styles.text2} maxLines={1}>
              {"Item will be delivered to: " +
                currentUser.first_name +
                " " +
                currentUser.last_name}
            </Text>
          </View>

          {/*view to insert address  */}
          <View style={styles.view2}>
            <Text style={styles.text2}>
              {"Address: " + deliveryInfo.address + ", #" + deliveryInfo.unitno}
            </Text>
          </View>

          {/*view to insert postal code  */}
          <View style={styles.view2}>
            <Text style={styles.text2}>
              {"Postal Code: " + deliveryInfo.postal_code}
            </Text>
          </View>
          <ListItemSeperator />
        </View>

        <View style={styles.button}>
          <Button //button for continue shopping
            title='Continue Shopping'
            onPress={() => navigation.popToTop()}
          />
        </View>
      </>
    );
  };

  return (
    <Screen style={styles.background}>
      {/*view for thank you message  */}

      {/*view for item image and item name  */}
      {/* <View style={styles.view2}>
        <Image
          source={{
            uri:
              "https://marvel-b1-cdn.bc0a.com/f00000000114841/www.florsheim.com/shop/images/14296-410.jpg",
          }}
          style={{ width: 100, height: 100 }}
        />
        <Text style={styles.text}>(Name of Item)Formal Shoes</Text>
      </View> */}

      <FlatList
        data={cart}
        keyExtractor={(item) => item.listingId}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 5 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.white,
              }}
            >
              <Icon
                name='storefront'
                backgroundColor={colors.white}
                iconColor='black'
              />
              <Text
                style={{
                  fontSize: 15,
                  width: 200,
                }}
                numberOfLines={1}
              >
                {item.store_name}
              </Text>
            </View>
            <ListItemSeperator />
            <View
              style={{ backgroundColor: colors.white, flexDirection: "row" }}
            >
              <Image source={{ uri: item.images[0] }} style={styles.image} />
              <View
                style={{
                  flexDirection: "column",
                  marginLeft: 10,
                }}
              >
                <Text
                  style={{ fontSize: 17, marginTop: 5, width: 250 }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <View style={{ marginTop: 5 }}>
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 15,
                    }}
                    numberOfLines={1}
                  >
                    {"Quantity:   x" + item.count}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    width: 280,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 15,
                        marginBottom: 5,
                      }}
                      numberOfLines={1}
                    >
                      {"Paid:   $" + item.paid.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        ItemSeparatorComponent={ListItemSeperator}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.whitegrey, paddingTop: 0 },
  image: {
    width: 80,
    height: 80,
    marginHorizontal: 10,
    marginVertical: 5,
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: colors.black,
  },

  background: {
    backgroundColor: colors.whitegrey,
  },

  button: {
    paddingTop: 20,
    paddingHorizontal: 50,
    justifyContent: "center",
  },

  text: {
    fontWeight: "bold",
    fontSize: 15,
    padding: 15,
  },

  text2: {
    fontSize: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
    color: colors.darkgray,
  },

  view2: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    marginBottom: 5,
  },
});

export default OrderConfirmedScreen;
