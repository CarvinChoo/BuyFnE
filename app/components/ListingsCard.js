import React, { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
// import { Image } from "react-native-expo-image-cache"; //for image blur when loading
import colors from "../config/colors";
import AppText from "./AppText";
import ListItemSeperator from "./lists/ListItemSeperator";
// function Card({ title, subTitle, imageUrl, onPress, thumbnailUrl })
function ListingsCard({ item, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        {/* Image component imported from react-native-expo-image-cache, different from reach-native */}
        <Image style={styles.image} source={{ uri: item.image }} />
        {/* <Image
          style={styles.image}
          // tint='light' // color of blur effect
          // preview={{ uri: thumbnailUrl }} // sets thumbnail for progressive loading ( blur effect on image)
          uri={imageUrl}
        /> */}
        <View style={styles.detailsContainer}>
          <AppText style={styles.title} numberOfLines={1}>
            {item.title}
          </AppText>
          {/*!!!!!!!!!!!!!!!!!!!!!!! Hard Coded Store Tag */}
          <View>
            <AppText
              style={{
                color: colors.muted,
                fontFamily: "sans-serif-light",
                marginBottom: 10,
              }}
              numberOfLines={1}
            >
              {"Sold by: " + item.store_name}
            </AppText>
          </View>
          <View style={[styles.subTitleContainer]}>
            <AppText
              style={[
                styles.subTitle,
                item.groupbuyId && {
                  textDecorationLine: "line-through",
                  textDecorationStyle: "solid",
                },
              ]}
              numberOfLines={1}
            >
              ${item.price.toFixed(2)}
            </AppText>
            {item.groupbuyId && (
              <AppText style={styles.subTitle2} numberOfLines={1}>
                ${item.discountedPrice}
              </AppText>
            )}
            {/* Discount Tag */}

            <View
              style={{
                backgroundColor: "teal",
                paddingHorizontal: 5,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: item.groupbuyId ? 10 : 20,
              }}
            >
              <AppText
                style={{
                  fontSize: 18,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {(!item.groupbuyId && "Group Buy: ") + item.discount + "% OFF"}
              </AppText>
            </View>
          </View>
          {/*!!!!!!!!!!!!!!!!!!!!!!! Hard coded Timer and stock*/}
          {item.groupbuyId ? (
            <>
              <ListItemSeperator />
              <View
                style={[
                  styles.subTitleContainer,
                  {
                    marginVertical: 5,
                    justifyContent: "center",
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: colors.green,
                    paddingHorizontal: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 18,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {"Group Buy " + item.groupbuyStatus}
                  </AppText>
                </View>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <MaterialCommunityIcons
                  name='account-group'
                  size={20}
                  color={colors.chocolate}
                  style={{}}
                />
                <AppText
                  style={{
                    fontSize: 14,
                    color: colors.chocolate,
                    fontWeight: "bold",
                    fontFamily: "sans-serif-medium",
                  }}
                >
                  {" "}
                  {item.currentOrderCount +
                    (item.currentOrderCount < item.minimumOrderCount &&
                      "/" + item.minimumOrderCount)}
                </AppText>
              </View>
            </>
          ) : (
            <View
              style={[
                styles.subTitleContainer,
                {
                  justifyContent: "space-between",
                  marginTop: 5,
                  flexDirection: "row-reverse",
                },
              ]}
            >
              <AppText
                style={{ color: "black", fontFamily: "sans-serif-condensed" }}
              >
                {"Stock: " + item.quantity + " left"}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: colors.white,
    marginVertical: 10,
    overflow: "hidden", //hides overflowed elements and keep it within limits
  },
  detailsContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "center",
  },
  subTitle: {
    color: "#ff3300",
    fontFamily: "sans-serif-light",
    fontWeight: "bold",
  },
  subTitle2: {
    color: colors.green,
    fontFamily: "sans-serif-light",
    fontWeight: "bold",
    marginLeft: 10,
  },
  title: {
    marginBottom: 0,
    fontFamily: "sans-serif-medium",
    fontWeight: "bold",
  },
  subTitleContainer: {
    flexDirection: "row",
  },
});
export default ListingsCard;
