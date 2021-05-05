import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import colors from "../../config/colors";
import AppText from "../AppText";
import ListItemSeperator from "./ListItemSeperator";
import color from "color";

function MessageListItem({
  chat = false,
  usertype,
  time,
  title,
  product_name,
  subTitle,
  status,
  image,
  IconComponent, //a real component
  onPress,
  renderRightActions,
  border = false, // default turns off border if not stated
  style,
  author_name,
}) {
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight
        underlayColor={colors.darkgrey} // changes the highlight color when pressed
        onPress={onPress}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: status == 0 ? colors.white : "#FAF3F3" },
            style,
          ]}
        >
          <View style={styles.detailsContainer}>
            <AppText
              style={{ fontSize: 11, color: colors.muted, fontWeight: "bold" }}
              numberOfLines={1}
            >
              {"Date: " + time.toDate().toDateString() + " "}
              {time.toDate().getHours() < 10
                ? "0" + time.toDate().getHours() + ":"
                : time.toDate().getHours() + ":"}
              {time.toDate().getMinutes() < 10
                ? "0" + time.toDate().getMinutes()
                : time.toDate().getMinutes()}
              {status == 1 && "                        Status: CLOSED"}
            </AppText>
            {chat ? (
              usertype == 1 ? (
                <AppText style={styles.title} numberOfLines={1}>
                  {"Store:  " + title}
                </AppText>
              ) : (
                <AppText style={styles.title} numberOfLines={1}>
                  {"Product:  " + product_name}
                </AppText>
              )
            ) : (
              <AppText style={styles.title} numberOfLines={1}>
                {"Topic:  "}
                {title}
              </AppText>
            )}
            <View style={{ flexDirection: "row" }}>
              {subTitle && (
                <AppText style={styles.subTitle} numberOfLines={2}>
                  {author_name + ":  " + subTitle}
                </AppText>
              )}
            </View>
          </View>
          <MaterialCommunityIcons
            color={colors.muted}
            name='chevron-right'
            size={25}
          />
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
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
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
  },
  subTitle: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "bold",
  },
});
export default MessageListItem;
