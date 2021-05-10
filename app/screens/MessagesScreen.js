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
import Swipeable from "react-native-gesture-handler/Swipeable";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";
import Icon from "../components/Icon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Yup from "yup";
import {
  AppForm,
  AppFormField,
  AppSquareFormField,
  SubmitButton,
} from "../components/forms";
// BackEnd
import AuthApi from "../api/auth";
import * as firebase from "firebase";
import db from "../api/db";

//Navigation
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";
const validationSchema = Yup.object().shape({
  topic: Yup.string().required().min(1).label("Topic"), //label is just to set the name for the field when displaying generic error message
  details: Yup.string().required().min(1).label("Details"),
});

function MessagesScreen({ navigation }) {
  //useState(initialMessages) returns an array, 1st element of the array is inital state variable
  // 2nd element of the array is the function name to be used to set the state
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const { currentUser } = useContext(AuthApi.AuthContext);
  useEffect(() => {
    setLoading(true);
    if (currentUser.type != 3) {
      db.collection("supportTickets")
        .where("user_uid", "==", currentUser.uid)
        .orderBy("status", "asc")
        .where("status", "<=", 1)
        .orderBy("date_created", "desc")
        .get()
        .then((tickets) => {
          if (!tickets.empty) {
            var tempTickets = [];
            tickets.forEach((tick) => {
              tempTickets.push({ ...tick.data() });
            });
            setTickets(tempTickets);
            setLoading(false);
          } else {
            setTickets([]);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error.message);
          Alert.alert("Failed to retrieve support tickets", error.message);
          setLoading(false);
        });
    } else {
      var sub = db
        .collection("supportTickets")
        .where("admin", "==", null)
        .where("status", "==", 0)
        .orderBy("date_created", "desc")
        .onSnapshot(
          (tickets) => {
            if (!tickets.empty) {
              var tempTickets = [];
              tickets.forEach((tick) => {
                tempTickets.push({ ...tick.data() });
              });
              setTickets(tempTickets);
              setLoading(false);
            } else {
              setTickets([]);
              setLoading(false);
            }
          },
          (error) => {
            setTickets([]);
            console.log(error.message);
            Alert.alert("Failed to retrieve support tickets", error.message);
            setLoading(false);
          }
        );
    }

    return () => {
      if (currentUser.type == 3) {
        sub();
      }
    };
  }, [refresh]);

  //This is a function
  const handleDelete = (item) => {
    db.collection("supportTickets")
      .doc(item.support_id)
      .delete()
      .then(() => {
        console.log("Deleted");
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  const handleSubmit = (supportTicket, { resetForm }) => {
    setModal(false);
    const ref = db.collection("supportTickets").doc();

    ref
      .set({
        support_id: ref.id,
        user_uid: currentUser.uid,
        user_name: currentUser.displayName,
        admin: null,
        topic: supportTicket.topic,
        date_created: firebase.firestore.Timestamp.now(),
        status: 0,
        messages: [
          {
            author: currentUser.uid,
            author_name: currentUser.displayName,
            time: firebase.firestore.Timestamp.now(),
            details: supportTicket.details,
          },
        ],
      })
      .then(() => {
        resetForm();
        setRefresh((refresh) => refresh + 1);
        Alert.alert(
          "Support Ticket created",
          "Please wait for our administrator to answer your queries."
        );
      })
      .catch((e) => {
        setModal(false);
        console.log(e.message);
        Alert.alert(
          "Error",
          "Failed to create new support ticket. Please try again later."
        );
      });
  };

  const renderFooter = () => {
    return <View style={{ backgroundColor: colors.whitegrey, height: 100 }} />;
  };

  return (
    // <View style={styles.screen}></View> // only use on android if SafeAreaView does not work
    <Screen style={{ backgroundColor: colors.whitegrey, paddingTop: 0 }}>
      <AppActivityIndicator visible={loading} />
      {tickets.length > 0 && (
        <View style={{ alignItems: "center", padding: 5 }}>
          <Text style={{ color: colors.muted, fontSize: 13 }}>
            Swipe left to remove tickets
          </Text>
        </View>
      )}
      {tickets.length > 0 ? (
        <FlatList
          data={tickets}
          keyExtractor={(each_message) => each_message.support_id} // what to be used to uniquely identify each element in the "messages" array
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => (
            <MessageListItem
              time={item.date_created}
              status={item.status}
              title={item.topic}
              subTitle={item.messages[item.messages.length - 1].details}
              author_name={item.messages[item.messages.length - 1].author_name}
              onPress={() =>
                navigation.navigate(routes.SUPPORTTICKET, item.support_id)
              }
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
            No Support Tickets
          </Text>
        </View>
      )}

      {currentUser.type != 3 && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => setModal(true)}
        >
          <MaterialCommunityIcons
            color={colors.teal}
            size={80}
            name='plus-circle'
          />
        </TouchableOpacity>
      )}
      <Modal transparent={true} visible={modal}>
        <View style={styles.modal}>
          <View style={styles.modalBoxContainer}>
            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacity onPress={() => setModal(false)}>
                <MaterialCommunityIcons name='close' size={25} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Support Ticket
              </Text>
            </View>
            <AppForm
              initialValues={{
                topic: "",
                details: "", // even though price is a number, but in a form, it is represented as a string>
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppFormField placeholder='Topic' name='topic' />
              <AppFormField
                placeholder='Details (explain your problem)'
                name='details'
                multiline
                numberOfLines={5}
              />
              <View style={{ marginTop: 5 }}>
                <SubmitButton title='Submit Ticket' />
              </View>
            </AppForm>
          </View>
        </View>
      </Modal>
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

export default MessagesScreen;
