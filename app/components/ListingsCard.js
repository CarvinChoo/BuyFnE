import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Text,
} from "react-native";
// import { Image } from "react-native-expo-image-cache"; //for image blur when loading
import colors from "../config/colors";
import ListItemSeperator from "./lists/ListItemSeperator";

// function Card({ title, subTitle, imageUrl, onPress, thumbnailUrl })
function ListingsCard({ item, onPress }) {
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
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
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {/*!!!!!!!!!!!!!!!!!!!!!!! Hard Coded Store Tag */}
          <View>
            <Text
              style={{
                color: colors.muted,
                fontFamily: "sans-serif-light",
                fontSize: 15,
                fontWeight: "bold",
              }}
              numberOfLines={1}
            >
              {"Sold by: " + item.store_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {maxRating.map((each, key) => {
              return each <= item.rating / item.reviews ? ( // if rating is larger than
                <MaterialCommunityIcons
                  key={each}
                  color={colors.goldenrod}
                  name='star'
                  size={20}
                />
              ) : each - item.rating / item.reviews <= 0.5 &&
                each - item.rating / item.reviews > 0 ? (
                <MaterialCommunityIcons
                  key={each}
                  color={colors.goldenrod}
                  name='star-half-full'
                  size={20}
                />
              ) : (
                <MaterialCommunityIcons
                  key={each}
                  name='star-outline'
                  size={20}
                  color={colors.muted}
                />
              );
            })}
          </View>
          <View style={[styles.subTitleContainer]}>
            <Text
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
            </Text>
            {item.groupbuyId && (
              <Text style={styles.subTitle2} numberOfLines={1}>
                ${item.discountedPrice.toFixed(2)}
              </Text>
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
              <Text
                style={{
                  fontSize: 17,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {(!item.groupbuyId && "Group Buy: ") + item.discount + "% OFF"}
              </Text>
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
                  <Text
                    style={{
                      fontSize: 15,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {"Group Buy " + item.groupbuyStatus}
                  </Text>
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
                <Text
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
                </Text>
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
              <Text
                style={{
                  color: colors.muted,
                  fontFamily: "sans-serif-condensed",
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {"Stock: " + item.quantity + " left"}
              </Text>
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
    resizeMode: "contain",
  },
  subTitle: {
    color: "#ff3300",
    fontFamily: "sans-serif-light",
    fontWeight: "bold",
    fontSize: 17,
  },
  subTitle2: {
    color: colors.green,
    fontFamily: "sans-serif-light",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 17,
  },
  title: {
    marginBottom: 0,
    fontFamily: "sans-serif-medium",
    fontWeight: "bold",
    fontSize: 18,
  },
  subTitleContainer: {
    flexDirection: "row",
  },
});
export default ListingsCard;
