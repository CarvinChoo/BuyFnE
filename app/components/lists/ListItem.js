import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";

import colors from "../../config/colors";
import AppText from "../AppText";
import Swipeable from "react-native-gesture-handler/Swipeable";

function ListItem({
  title,
  subTitle,
  image,
  IconComponent, //a real component
  onPress,
  renderRightActions,
  border = false, // default turns off border if not stated
}) {
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight
        underlayColor={colors.darkgrey} // changes the highlight color when pressed
        onPress={onPress}
      >
        <View style={styles.container}>
          {IconComponent}
          {image && (
            <Image
              style={[
                styles.image,
                border // boolean conditional styling
                  ? { borderWidth: 2, borderColor: colors.black }
                  : {},
              ]}
              source={image}
            />
          )}
          <View style={styles.detailsContainer}>
            <AppText style={styles.title}>{title}</AppText>
            {subTitle && <AppText style={styles.subTitle}>{subTitle}</AppText>}
          </View>
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
  },
  imageBorder: {
    borderWidth: 2,
    borderColor: colors.black,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
  },
  subTitle: {
    color: colors.muted,
  },
});
export default ListItem;
