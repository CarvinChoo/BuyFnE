import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AuthApi from "../api/auth";
import MessageTextInput from "../components/MessageTextInput";
import db from "../api/db";
import * as firebase from "firebase";

function ChatScreen({ route }) {
  const chat_id = route.params;
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { currentUser } = useContext(AuthApi.AuthContext);

  useEffect(() => {
    const sub = db
      .collection("chat")
      .doc(chat_id)
      .onSnapshot(
        (chat) => {
          if (chat.exists) {
            setChat(chat.data());
            var tempMessages = [];
            var i = 0;

            chat.data().messages.forEach((message) => {
              tempMessages.push({ ...message, key: i.toString() });
              i = i + 1;
            });

            setMessages(tempMessages.reverse());
          }
        },
        (error) => {
          console.log(error.message);
          Alert.alert("Error", "Failed to send message");
        }
      );

    return () => {
      sub();
    };
  }, []);
  const handleSubmit = (chat) => {
    if (chat.length > 0) {
      if (currentUser.type == 2) {
        db.collection("chat")
          .doc(chat_id)
          .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
              author: currentUser.uid,
              author_name: currentUser.store_name + " (seller)",
              time: firebase.firestore.Timestamp.now(),
              chat: chat,
            }),
          })
          .then(() => {
            setNewMessage("");
          })
          .catch((e) => {
            console.log(e.message);
          });
      } else if (currentUser.type == 3) {
        db.collection("chat")
          .doc(chat_id)
          .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
              author: currentUser.uid,
              author_name: currentUser.store_name + " (admin)",
              time: firebase.firestore.Timestamp.now(),
              chat: chat,
            }),
          })
          .then(() => {
            setNewMessage("");
          })
          .catch((e) => {
            console.log(e.message);
          });
      } else {
        db.collection("chat")
          .doc(chat_id)
          .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
              author: currentUser.uid,
              author_name: currentUser.displayName,
              time: firebase.firestore.Timestamp.now(),
              chat: chat,
            }),
          })
          .then(() => {
            setNewMessage("");
          })
          .catch((e) => {
            console.log(e.message);
          });
      }
    }
  };
  const renderFooter = () => {
    return (
      chat && (
        <View
          style={{
            alignItems: "center",
            padding: 10,
            justifyContent: "center",
            backgroundColor: colors.white,
            marginBottom: 10,
          }}
        >
          <Text
            style={{ fontSize: 17, fontWeight: "bold", color: colors.gray }}
          >
            Product: {chat.product_name}
          </Text>
        </View>
      )
    );
  };

  return (
    <Screen style={styles.container}>
      {chat ? (
        <>
          <FlatList
            inverted
            data={messages}
            ListFooterComponent={renderFooter}
            keyExtractor={(each_message) => each_message.key}
            renderItem={({ item }) => (
              <>
                {item.author != currentUser.uid ? (
                  <View
                    style={{
                      marginLeft: 10,
                      padding: 15,
                      backgroundColor: colors.white,
                      width: "80%",
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.muted,
                        marginBottom: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {item.author_name}:
                    </Text>
                    <Text style={{ marginBottom: 3 }}>{item.chat}</Text>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ color: colors.muted, fontSize: 10 }}>
                        {item.time.toDate().toDateString() + " "}
                        {item.time.toDate().getHours() < 10
                          ? "0" + item.time.toDate().getHours() + ":"
                          : item.time.toDate().getHours() + ":"}
                        {item.time.toDate().getMinutes() < 10
                          ? "0" + item.time.toDate().getMinutes()
                          : item.time.toDate().getMinutes()}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: "flex-end",
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        marginRight: 10,
                        padding: 15,
                        backgroundColor: colors.teal,
                        width: "80%",
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.lightgrey,
                          marginBottom: 5,
                          fontWeight: "bold",
                        }}
                      >
                        {item.author_name}:
                      </Text>
                      <Text style={{ color: colors.white, marginBottom: 3 }}>
                        {item.chat}
                      </Text>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ color: colors.lightgrey, fontSize: 10 }}>
                          {item.time.toDate().toDateString() +
                            " " +
                            item.time.toDate().getHours() +
                            ":"}
                          {item.time.toDate().getMinutes() < 10
                            ? "0" + item.time.toDate().getMinutes()
                            : item.time.toDate().getMinutes()}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </>
            )}
          />

          <MessageTextInput
            color={colors.white}
            placeholder='Type a message'
            multiline
            numberOfLines={1}
            newMessage={newMessage}
            onSubmit={(value) => {
              handleSubmit(value);
            }}
          />
        </>
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
            Chat does not exist
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.whitegrey, paddingTop: 0 },
});

export default ChatScreen;
