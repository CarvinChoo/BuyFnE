import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function ListItem({ title, subTitle, image, onPress }) {
  return (
    <TouchableHighlight
      underlayColor={colors.darkgrey} // changes the highlight color when pressed
      onPress={onPress}
    >
      <View style={styles.container}>
        <Image style={styles.image} source={image} />
        <View style={styles.titleContainer}>
          <AppText style={styles.title}>{title}</AppText>
          <AppText style={styles.subTitle}>{subTitle}</AppText>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
  },
  image: {
    width: 70,
    height: 70,
    borderWidth: 40,
    borderRadius: 35,
    marginRight: 10,
    overflow: "hidden",
    borderColor: colors.black,
    borderWidth: 2,
  },
  titleContainer: {
    padding: 5,
  },
  title: {
    fontWeight: "bold",
  },
  subTitle: {
    color: colors.muted,
  },
});
export default ListItem;
