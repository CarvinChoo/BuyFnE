import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
// import { Image } from "react-native-expo-image-cache"; //for image blur when loading
import colors from "../config/colors";
import AppText from "./AppText";
// function Card({ title, subTitle, imageUrl, onPress, thumbnailUrl })
function Card({ title, subTitle, discount, quantity = 0, image, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        {/* Image component imported from react-native-expo-image-cache, different from reach-native */}
        <Image style={styles.image} source={{ uri: image }} />
        {/* <Image
          style={styles.image}
          // tint='light' // color of blur effect
          // preview={{ uri: thumbnailUrl }} // sets thumbnail for progressive loading ( blur effect on image)
          uri={imageUrl}
        /> */}
        <View style={styles.detailsContainer}>
          <AppText style={styles.title} numberOfLines={1}>
            {title}
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
              {"Sold by: " + "Hermen Miller Inc."}
            </AppText>
          </View>
          <View style={[styles.subTitleContainer]}>
            <AppText style={styles.subTitle} numberOfLines={2}>
              {subTitle}
            </AppText>
            {/* Discount Tag */}
            {discount && (
              <View
                style={{
                  backgroundColor: "teal",
                  paddingHorizontal: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20,
                }}
              >
                <AppText
                  style={{
                    fontSize: 18,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {"Group Buy: " + discount + "% OFF"}
                </AppText>
              </View>
            )}
          </View>
          {/*!!!!!!!!!!!!!!!!!!!!!!! Hard coded Timer and stock*/}
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
              {"Stock Left: " + quantity}
            </AppText>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden", //hides overflowed elements and keep it within limits
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  subTitle: {
    color: "#ff3300",
    fontFamily: "sans-serif-light",
    fontWeight: "bold",
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
export default Card;
