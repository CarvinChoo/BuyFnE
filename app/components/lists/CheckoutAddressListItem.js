import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

import colors from "../../config/colors";
import AppText from "../AppText";
import ListItemSeperator from "./ListItemSeperator";

function CheckoutAddressListItem({
  title,
  subTitle,
  bottomTitle,
  IconComponent,
  onPress,
  renderRightActions,
  style,
}) {
  return (
    <>
      <ListItemSeperator />
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight
          underlayColor={colors.darkgrey} // changes the highlight color when pressed
          onPress={onPress}
        >
          <View
            style={{
              flexDirection: "column",
              padding: 10,
              backgroundColor: colors.white,
            }}
          >
            <View style={[styles.container, style]}>
              {IconComponent}
              <View style={styles.detailsContainer}>
                <AppText style={styles.title} numberOfLines={1}>
                  {title}
                </AppText>
              </View>
            </View>
            <View style={{ paddingLeft: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {subTitle && (
                  <AppText style={styles.subTitle} numberOfLines={2}>
                    {subTitle}
                  </AppText>
                )}
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
          </View>
        </TouchableHighlight>
      </Swipeable>
      <ListItemSeperator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageBorder: {
    borderWidth: 2,
    borderColor: colors.black,
  },
  detailsContainer: {
    paddingLeft: 10,
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
export default CheckoutAddressListItem;
