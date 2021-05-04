import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AuthApi from "../api/auth";
import MessageTextInput from "../components/MessageTextInput";
import AppButton from "../components/AppButton";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import db from "../api/db";
import * as firebase from "firebase";
function TicketScreen({ route, navigation }) {
  const support_id = route.params;
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { currentUser } = useContext(AuthApi.AuthContext);

  useEffect(() => {
    const sub = db
      .collection("supportTickets")
      .doc(support_id)
      .onSnapshot(
        (ticket) => {
          if (ticket.exists) {
            setTicket(ticket.data());
            var tempMessages = [];
            var i = 0;

            ticket.data().messages.forEach((message) => {
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
  const closeTicket = () => {
    db.collection("supportTickets")
      .doc(support_id)
      .update({
        status: 1,
      })
      .then(() => {
        currentUser.type != 3
          ? Alert.alert(
              "Thank you for your query",
              "Hope we have answered your questions."
            )
          : Alert.alert("Success", "Support ticket has been closed");
      })
      .catch((e) => {
        console.log(e.message);
        Alert.alert(
          "Failed to close support ticket.",
          "Please try again later."
        );
      });
  };
  const handleSubmit = (details) => {
    if (currentUser.type == 3 && ticket.admin == null) {
      if (details.length > 0) {
        db.collection("supportTickets")
          .doc(support_id)
          .update({
            admin: currentUser.uid,
            messages: firebase.firestore.FieldValue.arrayUnion({
              author: currentUser.uid,
              author_name: currentUser.displayName,
              time: firebase.firestore.Timestamp.now(),
              details: details,
            }),
          })
          .then(() => {
            setNewMessage("");
          })
          .catch((e) => {
            console.log(e.message);
          });
      }
    } else {
      if (details.length > 0) {
        db.collection("supportTickets")
          .doc(support_id)
          .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
              author: currentUser.uid,
              author_name: currentUser.displayName,
              time: firebase.firestore.Timestamp.now(),
              details: details,
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
      ticket && (
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
            Topic: {ticket.topic}
          </Text>
        </View>
      )
    );
  };
  const renderHeader = () => {
    return (
      ticket &&
      ticket.status == 1 && (
        <View
          style={{
            height: 80,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 20, color: colors.muted, fontWeight: "bold" }}
          >
            Ticket has been closed.
          </Text>
        </View>
      )
    );
  };
  return (
    <Screen style={styles.container}>
      {ticket && ticket.status == 0 && (
        <View style={{ alignItems: "center" }}>
          <AppButton
            title='Close Ticket'
            style={{ padding: 3, width: "95%", marginVertical: 0 }}
            onPress={() => {
              closeTicket();
            }}
          />
        </View>
      )}
      <FlatList
        inverted
        data={messages}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
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
                <Text style={{ marginBottom: 3 }}>{item.details}</Text>
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
                    {item.details}
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

      {ticket && ticket.status == 0 && (
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
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.whitegrey, paddingTop: 0 },
});

export default TicketScreen;
