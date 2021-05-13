import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Platform,
  StatusBar,
  View,
  TouchableOpacity,
  Modal,
  Text,
  Alert,
} from "react-native";

import Screen from "../components/Screen";
import MessageListItem from "../components/lists/MessageListItem";
import colors from "../config/colors";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";

// BackEnd
import AuthApi from "../api/auth";
//Navigation
import routes from "../navigation/routes";
import db from "../api/db";
import AppActivityIndicator from "../components/AppActivityIndicator";

function ChatMessagesScreen({ navigation }) {
  //useState(initialMessages) returns an array, 1st element of the array is inital state variable
  // 2nd element of the array is the function name to be used to set the state
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    if (currentUser.type == 2) {
      var sub = db
        .collection("chat")
        .where("seller", "==", currentUser.uid)
        .orderBy("date_created", "desc")
        .onSnapshot(
          (chats) => {
            if (!chats.empty) {
              var tempChats = [];
              chats.forEach((msg) => {
                tempChats.push({ ...msg.data() });
              });
              setChats(tempChats);
              setLoading(false);
            } else {
              setChats([]);
              setLoading(false);
            }
          },
          (error) => {
            console.log(error.message);
            setLoading(false);
          }
        );
    } else {
      var sub = db
        .collection("chat")
        .where("user_uid", "==", currentUser.uid)
        .orderBy("date_created", "desc")
        .onSnapshot(
          (chats) => {
            if (!chats.empty) {
              var tempChats = [];
              chats.forEach((msg) => {
                tempChats.push({ ...msg.data() });
              });
              setChats(tempChats);
              setLoading(false);
            } else {
              setChats([]);
              setLoading(false);
            }
          },
          (error) => {
            console.log(error.message);
            setLoading(false);
          }
        );
    }

    return () => {
      sub();
    };
  }, []);

  //This is a function
  const handleDelete = (item) => {
    db.collection("chat")
      .doc(item.chat_id)
      .delete()
      .then(() => {
        console.log("Deleted Chat");
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const renderFooter = () => {
    return <View style={{ backgroundColor: colors.whitegrey, height: 100 }} />;
  };

  return (
    <Screen style={{ backgroundColor: colors.whitegrey, paddingTop: 0 }}>
      <AppActivityIndicator visible={loading} />
      {chats.length > 0 && (
        <View style={{ alignItems: "center", padding: 5 }}>
          <Text style={{ color: colors.muted, fontSize: 13 }}>
            Swipe left to remove chat
          </Text>
        </View>
      )}

      {chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(each_message) => each_message.chat_id} // what to be used to uniquely identify each element in the "messages" array
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => (
            <MessageListItem
              time={item.date_created}
              status={0}
              chat={true}
              product_name={item.product_name}
              usertype={currentUser.type}
              title={item.store_name}
              subTitle={item.messages[item.messages.length - 1].chat}
              author_name={item.messages[item.messages.length - 1].author_name}
              onPress={() => navigation.navigate(routes.CHATROOM, item.chat_id)}
              renderRightActions={() => (
                <ListItemDeleteAction onPress={() => handleDelete(item)} />
              )}
            />
          )} // destructure "item" object  extract out "item" properties to be passed into ListItem
          ItemSeparatorComponent={ListItemSeperator} // a properties that requires an object to be used to seperate each item in "messages" array
        />
      ) : (
        <View
          style={{
            paddingHorizontal: 30,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: "50%",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: colors.grey,
            }}
          >
            No Active Chat
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 100,
    backgroundColor: colors.white,
  },

  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
  },
  modalBoxContainer: {
    backgroundColor: colors.white,
    marginTop: 50,
    borderRadius: 5,
    padding: 20,
    paddingTop: 5,
  },
});

export default ChatMessagesScreen;
