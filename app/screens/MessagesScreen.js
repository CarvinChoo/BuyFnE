import React from "react";
import { FlatList, StyleSheet, Platform, StatusBar, View } from "react-native";

import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import ListItemSeperator from "../components/ListItemSeperator";
import Swipeable from "react-native-gesture-handler/Swipeable";
import ListItemDeleteAction from "../components/ListItemDeleteAction";

const messages = [
  // hardcoded, will be pulled later in backend
  {
    id: 1,
    title: "T1",
    description: "D1",
    image: require("../assets/HnMlogo.png"),
  },
  {
    id: 2,
    title: "T2",
    description: "D2",
    image: require("../assets/HnMlogo.png"),
  },
];
function MessagesScreen(props) {
  return (
    // <View style={styles.screen}></View> // only use on android if SafeAreaView does not work
    <Screen>
      <FlatList
        data={messages}
        keyExtractor={(each_message) => each_message.id.toString()} // what to be used to uniquely identify each element in the "messages" array
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.description}
            image={item.image}
            onPress={() => console.log("Message Selected", item)}
            renderRightActions={ListItemDeleteAction}
          />
        )} // destructure "item" object  extract out "item" properties to be passed into ListItem
        ItemSeparatorComponent={ListItemSeperator} // a properties that requires an object to be used to seperate each item in "messages" array
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
