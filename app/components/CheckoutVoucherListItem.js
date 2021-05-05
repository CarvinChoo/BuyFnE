import React from "react";
import { Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";
import ListItemSeperator from "./lists/ListItemSeperator";
import colors from "../config/colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Icon from "./Icon";
function CheckoutVoucherListItem({ item, onPress }) {
  const categories = [
    {
      label: "All",
      value: 0,
      backgroundColor: colors.brightred,
      icon: "storefront",
      IconType: MaterialCommunityIcons,
    },
    {
      label: "Furniture",
      value: 1,
      backgroundColor: "saddlebrown",
      icon: "table-furniture",
      IconType: MaterialCommunityIcons,
    },
    {
      label: "Clothing",
      value: 2,
      backgroundColor: "palevioletred",
      icon: "shoe-formal",
      IconType: MaterialCommunityIcons,
    },
    {
      label: "Food",
      value: 3,
      backgroundColor: "orange",
      icon: "food-fork-drink",
      IconType: MaterialCommunityIcons,
    },
    {
      label: "Games",
      value: 4,
      backgroundColor: "green",
      icon: "games",
      IconType: MaterialIcons,
    },
    {
      label: "Computer",
      value: 5,
      backgroundColor: colors.muted,
      icon: "computer",
      IconType: MaterialIcons,
    },
    {
      label: "Health",
      value: 6,
      backgroundColor: "red",
      icon: "heart-plus",
      IconType: MaterialCommunityIcons,
    },
    {
      label: "Books",
      value: 7,
      backgroundColor: "maroon",
      icon: "bookshelf",
      IconType: MaterialCommunityIcons,
    },
    {
      label: "Electronic",
      value: 8,
      backgroundColor: "skyblue",
      icon: "electrical-services",
      IconType: MaterialIcons,
    },
  ];
  return (
    <>
      <TouchableWithoutFeedback style={styles.container} onPress={onPress}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: item.apply ? colors.white : colors.whitegrey,
          }}
        >
          {item.store_logo ? (
            <Image style={styles.image} source={{ uri: item.store_logo }} />
          ) : (
            <View style={{ justifyContent: "center", marginLeft: 10 }}>
              <Icon
                backgroundColor={categories[item.category].backgroundColor}
                name={categories[item.category].icon}
                IconType={categories[item.category].IconType}
                size={80}
              />
            </View>
          )}
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
            {item.store_name ? (
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
            ) : (
              <AppText
                numberOfLines={1}
                style={{
                  color: colors.muted,
                  fontSize: 15,
                  width: 250,
                }}
              >
                {"Category: " + categories[item.category].label}
              </AppText>
            )}
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
