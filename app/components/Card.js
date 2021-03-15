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
function Card({ title, subTitle, image, onPress }) {
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
          <AppText style={styles.subTitle} numberOfLines={2}>
            {subTitle}
          </AppText>
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
    color: colors.cyan,
    fontWeight: "bold",
  },
  title: {
    marginBottom: 7,
  },
});
export default Card;
