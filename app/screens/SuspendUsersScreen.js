import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import * as Yup from "yup";
import {
  AppForm,
  SubmitButton,
  AppExpiryPicker,
  AppDatePicker,
} from "../components/forms";

import ListItemSeperator from "../components/lists/ListItemSeperator";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { SearchBar } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
//Backend
import db from "../api/db";
import AuthApi from "../api/auth"; // for context
import * as firebase from "firebase";
import axios from "axios";

const validationSchema = Yup.object().shape({
  unsuspend_date: Yup.string()
    .required("Suspend till Date is required")
    .label("Suspend till Date"),
});

const defaultImage =
  "https://firebasestorage.googleapis.com/v0/b/buyfne-63905.appspot.com/o/D9cp9EwNrmT4A0GcOATzQnWPZ9p2%2FprofilePicture.jpeg?alt=media&token=938d2095-5ac2-4836-8421-092a1b3e8545";
function SuspendUsersScreen(props) {
  const [users, setUsers] = useState([]);
  const [permUsers, setPermUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const { currentUser } = useContext(AuthApi.AuthContext);
  useEffect(() => {
    setLoading(true);
    const sub = db
      .collection("users")
      .orderBy("displayName", "asc")
      .onSnapshot(
        (users) => {
          if (!users.empty) {
            const tempUsers = [];
            users.forEach((user) => {
              tempUsers.push({ ...user.data() });
            });
            setUsers(tempUsers);
            setPermUsers(tempUsers);
            setLoading(false);
          } else {
            console.log("No Users");
            setUsers([]);
            setPermUsers([]);
            setLoading(false);
          }
        },
        (error) => {
          Alert.alert("Error", error.message);
        }
      );
    return () => {
      sub();
    };
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
    // setListings(() => {

    // });
    var found = permUsers.filter((user) => {
      return (
        user.email.toUpperCase().includes(search.toUpperCase()) ||
        user.uid.toUpperCase().includes(search.toUpperCase()) ||
        user.displayName.toUpperCase().includes(search.toUpperCase())
      );
    });
    setUsers(found);
  };

  const renderFooter = () => {
    return <View style={{ height: 50 }}></View>;
  };

  const suspendWithDate = (form) => {
    setModal(false);
    setLoading1(true);
    const dateparse = new Date(JSON.parse(form.unsuspend_date));
    const number = dateparse.getTime();

    if (user) {
      axios({
        // issueing refund using cloud functiosn to communicate with stripe api
        method: "POST",
        url: "https://us-central1-buyfne-63905.cloudfunctions.net/suspendUser",
        data: {
          isMerchant: user.isMerchant,
          uid: user.uid,
          date: number,
        },
      })
        .then(({ _, data }) => {
          setUser(null);
          console.log(data);
          console.log("Suspended User");
          Alert.alert("Success", "User Suspended");
          setLoading1(false);
        })
        .catch((error) => {
          setUser(null);
          console.log("Error : ", error.message);
          Alert.alert("Error", error.message);
          setLoading1(false);
        });
    } else {
      setUser(null);
      setLoading1(true);
      console.log("state is slow");
    }
  };
  const suspendUser = () => {
    setModal(false);
    setLoading1(true);
    if (user) {
      axios({
        // issueing refund using cloud functiosn to communicate with stripe api
        method: "POST",
        url: "https://us-central1-buyfne-63905.cloudfunctions.net/suspendUser",
        data: {
          isMerchant: user.isMerchant,
          uid: user.uid,
          date: null,
        },
      })
        .then(({ _, data }) => {
          setUser(null);
          console.log(data);
          console.log("Suspended User");
          Alert.alert("Success", "User Suspended");
          setLoading1(false);
        })
        .catch((error) => {
          setUser(null);
          console.log("Error : ", error.message);
          Alert.alert("Error", error.message);
          setLoading1(false);
        });
    } else {
      setUser(null);
      console.log("state is slow");
      setLoading1(true);
    }
  };

  const unsuspendUser = (item) => {
    setModal(false);
    setLoading1(true);
    axios({
      // issueing refund using cloud functiosn to communicate with stripe api
      method: "POST",
      url: "https://us-central1-buyfne-63905.cloudfunctions.net/unsuspendUser",
      data: {
        uid: item.uid,
      },
    })
      .then(({ _, data }) => {
        console.log("Unsuspended User");
        Alert.alert("Success", "User Unsuspended");
        setLoading1(false);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
        setLoading1(false);
      });
  };

  return (
    <Screen style={styles.container}>
      <AppActivityIndicator visible={loading} />
      <AppActivityIndicator visible={loading1} />
      <SearchBar
        containerStyle={{
          borderBottomWidth: 2,
          borderBottomColor: colors.grey,
        }}
        placeholder='Search UID, Name, Email'
        placeholderTextColor={colors.muted}
        platform='android'
        onChangeText={updateSearch}
        value={search}
      />
      <FlatList
        style={{ paddingHorizontal: 10, paddingTop: 10 }}
        data={users}
        keyExtractor={(item) => item.uid}
        // ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              backgroundColor: item.suspended ? "#FFC9C9" : colors.white,
              borderRadius: 10,
              marginBottom: 5,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {item.profilePic ? (
                <Image
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    marginRight: 10,
                    borderWidth: 0.5,
                    borderColor: colors.muted,
                  }}
                  source={{ uri: item.profilePic }}
                />
              ) : (
                <Image
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    marginRight: 10,
                  }}
                  source={{ uri: defaultImage }}
                />
              )}
              <View style={{ justifyContent: "center" }}>
                {item.type == 3 && (
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[styles.field, { color: colors.mediumvioletred }]}
                    >
                      {"Admin Account"}
                    </Text>
                  </View>
                )}
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.field}>{"UID:  "}</Text>
                  <Text style={styles.value} numberOfLines={1}>
                    {item.uid}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.field}>{"Merchant:  "}</Text>
                  <Text
                    style={[
                      styles.value,
                      {
                        color: !item.isMerchant
                          ? colors.brown
                          : colors.seagreen,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.isMerchant ? "True" : "False"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.field}>{"Name:  "}</Text>
                  <Text style={styles.value} numberOfLines={1}>
                    {item.displayName}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.field}>{"Email:  "}</Text>
                  <Text style={styles.value} numberOfLines={1}>
                    {item.email}
                  </Text>
                </View>

                {item.suspended && (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.field}>{"Until:  "}</Text>
                    <Text
                      style={[styles.value, { color: colors.seagreen }]}
                      numberOfLines={1}
                    >
                      {item.suspended_till
                        ? item.suspended_till.toDate().toDateString()
                        : "INDEFINITE"}
                    </Text>
                  </View>
                )}
              </View>
              {item.suspended && item.uid != currentUser.uid ? (
                <TouchableOpacity
                  style={{ justifyContent: "center" }}
                  onPress={() => {
                    unsuspendUser(item);
                  }}
                >
                  <MaterialCommunityIcons
                    name='account-check'
                    size={30}
                    color={colors.darkgreen}
                  />
                </TouchableOpacity>
              ) : (
                item.uid != currentUser.uid && (
                  <TouchableOpacity
                    style={{ justifyContent: "center" }}
                    onPress={() => {
                      setUser(item);
                      setModal(true);
                    }}
                  >
                    <MaterialCommunityIcons
                      name='account-cancel'
                      size={30}
                      color={colors.brightred}
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        )}
        ItemSeparatorComponent={ListItemSeperator}
      />
      <Modal transparent={true} visible={modal}>
        <View style={styles.modal}>
          <View style={styles.modalBoxContainer}>
            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={() => {
                  setUser(null);
                  setModal(false);
                }}
              >
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
                Suspend User
              </Text>
            </View>
            <AppForm
              initialValues={{
                unsuspend_date: "", // even though price is a number, but in a form, it is represented as a string>
              }}
              onSubmit={suspendWithDate}
              validationSchema={validationSchema}
            >
              <View style={{ alignItems: "center" }}>
                <AppExpiryPicker title='Suspend till' name='unsuspend_date' />
              </View>
              <View style={{ marginTop: 5 }}>
                <SubmitButton
                  title='Suspend with Date'
                  color='lightcoral'
                  style={{ marginBottom: 15 }}
                />
                <ListItemSeperator />
                <AppButton
                  title='Suspend indefinitely'
                  color='maroon'
                  style={{ marginTop: 15 }}
                  onPress={() => suspendUser()}
                />
              </View>
            </AppForm>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whitegrey,
    paddingTop: 0,
  },
  field: { fontSize: 12, fontWeight: "bold" },
  value: { fontSize: 12, width: 180, color: "#3C3838" },

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

export default SuspendUsersScreen;
