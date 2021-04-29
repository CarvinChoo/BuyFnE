import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
} from "react-native";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import colors from "../config/colors";
import Screen from "../components/Screen";
import AppText from "../components/AppText";

//Navigation
import routes from "../navigation/routes";

function ReceiptScreen({ route, navigation }) {
  const item = route.params;
  return (
    <Screen style={styles.background}>
      <View style={styles.view2}>
        <View style={{ flexDirection: "row", padding: 15 }}>
          <Image
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              borderWidth: 1,
              overflow: "hidden",
              borderColor: colors.black,
              marginRight: 10,
            }}
            source={{ uri: item.store_logo }}
          />
          <Text style={styles.text}>{item.store_name}</Text>
        </View>
        <TouchableHighlight
          style={{
            backgroundColor: colors.darkslategrey,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
          onPress={() => {
            navigation.navigate(routes.LISTING_DETAILS, item.product_id);
          }}
        >
          <AppText style={{ fontWeight: "bold", color: colors.white }}>
            Visit Product
          </AppText>
        </TouchableHighlight>
      </View>
      <ListItemSeperator />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: colors.white,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <AppText
          style={{ fontSize: 13, color: colors.muted, fontWeight: "bold" }}
        >
          {"Order ID:"}
        </AppText>
        <AppText style={{ fontSize: 13, color: colors.muted }}>
          {item.transaction_id}
        </AppText>
      </View>
      <ListItemSeperator />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: colors.white,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: colors.black,
            marginRight: 10,
          }}
          source={{ uri: item.image }}
        />
        <View style={{ flex: 1 }}>
          <AppText style={{ fontSize: 15, fontWeight: "bold" }}>
            {item.product_title}
          </AppText>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AppText style={{ fontSize: 14, color: colors.muted }}>
              {"Quantity:"}
            </AppText>
            <AppText style={{ fontSize: 14, color: colors.muted }}>
              {"x " + item.count}
            </AppText>
          </View>
          {item.groupbuy && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <AppText style={{ fontSize: 14, color: colors.muted }}>
                {"Type:"}
              </AppText>
              <AppText style={{ fontSize: 14, color: colors.muted }}>
                {"GroupBuy"}
              </AppText>
            </View>
          )}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AppText style={{ fontSize: 13, color: colors.muted }}>
              {"Original Price per:"}
            </AppText>
            <AppText style={{ fontSize: 13, color: colors.muted }}>
              {"$" + item.original_price.toFixed(2)}
            </AppText>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AppText style={{ fontSize: 13, color: colors.muted }}>
              {"Discount:"}
            </AppText>
            <AppText style={{ fontSize: 13, color: colors.muted }}>
              {"-$" + item.discount.toFixed(2)}
            </AppText>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AppText style={{ fontSize: 13, color: colors.muted }}>
              {"Paid:"}
            </AppText>
            <AppText style={{ fontSize: 13, color: colors.muted }}>
              {"$" + item.paid.toFixed(2)}
            </AppText>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AppText style={{ fontSize: 13, color: colors.muted }}>
              {"Shipping:"}
            </AppText>
            <AppText style={{ fontSize: 13, color: colors.muted }}>
              {"$1.99"}
            </AppText>
          </View>
        </View>
      </View>
      <ListItemSeperator />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: colors.white,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <AppText
            style={{ fontSize: 13, color: colors.muted, fontWeight: "bold" }}
          >
            {"Delivery Address:"}
          </AppText>
          <AppText style={{ fontSize: 13, color: colors.muted }}>
            {item.buyer_name}
          </AppText>
          <AppText style={{ fontSize: 13, color: colors.muted }}>
            {item.shipping.address + ", #" + item.shipping.unitno}
          </AppText>
          <AppText style={{ fontSize: 13, color: colors.muted }}>
            {item.shipping.postal_code}
          </AppText>
        </View>
      </View>
      <ListItemSeperator />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: colors.white,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <AppText
            style={{ fontSize: 13, color: colors.muted, fontWeight: "bold" }}
          >
            {"Order Time:"}
          </AppText>
          <AppText style={{ fontSize: 13, color: colors.muted }}>
            {item.orderDate}
          </AppText>
        </View>
      </View>
      {item.status != 6 && !item.confirmedDeliveryTime && (
        <>
          <ListItemSeperator />
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: colors.white,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  color: colors.muted,
                  fontWeight: "bold",
                }}
              >
                {"Estimated Arrival Time:"}
              </AppText>
              <AppText style={{ fontSize: 13, color: colors.muted }}>
                {item.estimatedDeliveryTime}
              </AppText>
            </View>
          </View>
        </>
      )}
      {item.confirmedDeliveryTime && (
        <>
          <ListItemSeperator />
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: colors.white,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  color: colors.muted,
                  fontWeight: "bold",
                }}
              >
                {"Delivered Time:"}
              </AppText>
              <AppText style={{ fontSize: 13, color: colors.muted }}>
                {item.confirmedDeliveryTime.toDate().toDateString()}
              </AppText>
            </View>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.whitegrey,
    paddingTop: 0,
  },

  text: {
    fontWeight: "bold",
    fontSize: 20,
  },

  text2: {
    fontSize: 15,
    padding: 15,
  },

  view2: {
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ReceiptScreen;
