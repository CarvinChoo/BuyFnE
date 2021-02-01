import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1, // the container
        flexDirection: "row", //set primary axis, using row makes it align from left to right
        // default direction is top to bottom from the left
        justifyContent: "center", //align items along main/primary axis
        alignItems: "center", //align items along secondary axis within each line
        //baseline enforces same bottom line for all
        //stretch forces baseline to be on the top
        alignContent: "center", // determines the alignment of the entire content as a whole, only has effect is used with flexWrap
        flexWrap: "wrap", // forces items that are too big to stay in 1 line to move to another line while keeping their intended size
      }}
    >
      <View
        style={{
          backgroundColor: "dodgerblue",
          // flex: 2,
          width: 100,
          height: 300,
          // alignSelf: "flex-start", // make this particular element align with "start" for primary axis or "end" for end of primary axis as baseline
        }}
      />
      <View
        style={{
          backgroundColor: "gold",
          // flex: 1,
          width: 100,
          height: 100,
        }}
      />
      <View
        style={{
          backgroundColor: "tomato",
          // flex: 1, // all flex 1 in a container will result in even divde
          // other flex will result in them filling bigger ratios
          width: 100,
          height: 100,
        }}
      />
      <View
        style={{
          backgroundColor: "grey",
          // flex: 1, // all flex 1 in a container will result in even divde
          // other flex will result in them filling bigger ratios
          width: 100,
          height: 100,
        }}
      />
      <View //overflow causes some items to get shrank but doesnt change others
        style={{
          backgroundColor: "greenyellow",
          // flex: 1, // all flex 1 in a container will result in even divde
          // other flex will result in them filling bigger ratios
          width: 100,
          height: 100,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
