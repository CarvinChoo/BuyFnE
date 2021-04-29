import React from "react";
import { Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";
import ListItemSeperator from "./lists/ListItemSeperator";
import colors from "../config/colors";
function CheckoutVoucherListItem({ item, onPress }) {
  return (
    <>
      <TouchableWithoutFeedback style={styles.container} onPress={onPress}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: item.apply ? colors.white : colors.whitegrey,
          }}
        >
          <Image style={styles.image} source={{ uri: item.store_logo }} />

          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <AppText
              numberOfLines={1}
              style={{
                fontSize: 17,
                color: item.apply ? colors.black : colors.muted,
              }}
            >
              {item.percentage_discount <= 0
                ? "$" +
                  item.amount_discount +
                  " OFF  Min. Spend $" +
                  item.minimum_spending
                : item.percentage_discount +
                  "%" +
                  " OFF  Min. Spend $" +
                  item.minimum_spending}
            </AppText>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                {"Valid till: " + item.expiry_date_string}
              </AppText>
              {item.apply && (
                <AppText
                  style={{
                    color: colors.muted,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Applicable
                </AppText>
              )}
            </View>
            <AppText
              numberOfLines={1}
              style={{
                color: colors.muted,
                fontSize: 15,
                width: 250,
              }}
            >
              {"Store: " + item.store_name}
            </AppText>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <ListItemSeperator />
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white },
  image: {
    height: 110,
    width: 110,
    resizeMode: "center",
  },
});

export default CheckoutVoucherListItem;
