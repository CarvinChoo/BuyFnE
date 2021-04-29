import React, { useState } from "react";
import { FlatList, StyleSheet, Platform, StatusBar, View } from "react-native";

import Screen from "../components/Screen";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import Swipeable from "react-native-gesture-handler/Swipeable";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";

const initialMessages = [
  // hardcoded, will be pulled later in backend
  {
    id: 1,
    title: "Jane Doe",
    description:
      "Hi, I have a question to ask about this group buy feature on this BuyFnE application.",
    image: require("../assets/default-profile-pic.jpg"),
  },
  {
    id: 2,
    title: "Jane Doe",
    description:
      "My payment went through but it did not appear in my order history.",
    image: require("../assets/default-profile-pic.jpg"),
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
              image: null,
            },
          ]);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
