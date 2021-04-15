import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

import colors from "../../config/colors";
import AppText from "../AppText";

function AddressListItem({
  title,
  subTitle,
  bottomTitle,
  onPress,
  renderRightActions,
  style,
}) {
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight
        underlayColor={colors.darkgrey} // changes the highlight color when pressed
        onPress={onPress}
      >
        <View
          style={{
            flexDirection: "column",
            padding: 15,
            backgroundColor: colors.white,
          }}
        >
          <View style={[styles.container, style]}>
            <View style={styles.detailsContainer}>
              <AppText style={styles.title} numberOfLines={1}>
                {title}
              </AppText>
              {subTitle && (
                <AppText style={styles.subTitle} numberOfLines={2}>
                  {subTitle}
                </AppText>
              )}
            </View>
            <MaterialCommunityIcons
              color={colors.muted}
              name='chevron-right'
              size={25}
            />
          </View>
          {bottomTitle && (
            <AppText style={styles.bottomTitle} numberOfLines={2}>
              {bottomTitle}
            </AppText>
          )}
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
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
    flex: 1,

    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    color: colors.muted,
    fontSize: 15,
  },
  subTitle: {
    color: colors.muted,
    fontSize: 15,
  },
  bottomTitle: {
    color: colors.muted,
    fontSize: 15,
  },
});
export default AddressListItem;
