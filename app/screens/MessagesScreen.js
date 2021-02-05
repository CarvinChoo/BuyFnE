import React, { useState } from "react";
import { FlatList, StyleSheet, Platform, StatusBar, View } from "react-native";

import Screen from "../components/lists/Screen";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import Swipeable from "react-native-gesture-handler/Swipeable";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";

const initialMessages = [
  // hardcoded, will be pulled later in backend
  {
    id: 1,
    title: "Carvin Choo",
    description:
      "Hooks solve a wide variety of seemingly unconnected problems in React that we’ve encountered over five years of writing and maintaining tens of thousands of components. Whether you’re learning React, use it daily, or even prefer a different library with a similar component model, you might recognize some of these problems.",
    image: require("../assets/HnMlogo.png"),
  },
  {
    id: 2,
    title: "Carvin Choo",
    description:
      "I am interested in this chair. Can we discuss more about the price?",
    image: require("../assets/HnMlogo.png"),
  },
];
function MessagesScreen(props) {
  const [messages, setMessages] = useState(initialMessages); // destructuring syntax
  //useState(initialMessages) returns an array, 1st element of the array is inital state variable
  // 2nd element of the array is the function name to be used to set the state
  const [refreshing, setRefreshing] = useState(false);

  //This is a function
  const handleDelete = (message) => {
    // "message" means passing a message object into the below function
    //Delete message from "messages" array
    setMessages(messages.filter((m) => m.id !== message.id)); //filters only non-matching ids and removes the matching ones

    //.Call.the.Server
  };
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
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )} // destructure "item" object  extract out "item" properties to be passed into ListItem
        ItemSeparatorComponent={ListItemSeperator} // a properties that requires an object to be used to seperate each item in "messages" array
        refreshing={refreshing} // used to refresh page
        onRefresh={() => {
          // usually used to retreive from server
          setMessages([
            // set state of Messages
            {
              id: 2,
              title: "T2",
              description: "D2",
              image: require("../assets/HnMlogo.png"),
            },
          ]);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
