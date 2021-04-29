import React from "react";
import { StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { useNetInfo } from "@react-native-community/netinfo";
import colors from "../config/colors";
import AppText from "./AppText";

function OfflineNotice(props) {
  const netInfo = useNetInfo();
  console.log(netInfo);
  if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false)
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>No Internet Connection</AppText>
      </View>
    );
  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 1, // use zIndex for iOS and elevation for android, to move component forward.
    backgroundColor: colors.brightred,
    height: 50,
    position: "absolute",
    width: "100%",
    top: Constants.statusBarHeight,
  },
  text: {
    color: colors.white,
  },
});

export default OfflineNotice;
