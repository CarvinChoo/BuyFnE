import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Alert,
  TextInput,
  Button,
  Modal,
  TouchableHighlight,
} from "react-native";
import * as Yup from "yup";
//BackEnd
import app from "../auth/base.js";
import db from "../api/db";
import AuthApi from "../api/auth";
import axios from "axios";
import * as firebase from "firebase";
//Front End
import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  Error_Message,
  SubmitButton,
} from "../components/forms";
import AppActivityIndicator from "../components/AppActivityIndicator";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import colors from "../config/colors.js";
import AppText from "../components/AppText.js";
import AddressListItem from "../components/lists/AddressListItem.js";
import ListItem from "../components/lists/ListItem.js";
import Icon from "../components/Icon.js";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction.js";

const validationSchema = Yup.object().shape({
  address: Yup.string().required("Address is required"),
  unitno: Yup.string().required("Unit Number is required"),
  postal_code: Yup.string()
    .required("Postal Code is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Must be exactly 6 digits")
    .max(6, "Must be exactly 6 digits"),
});

function ShippingAddressesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [fetch, setFetch] = useState(0);
  const [shippings, setShippings] = useState([]);
  const [toBeDefault, setToBeDefault] = useState(null);
  const [currentDefault, setCurrentDefault] = useState(null);
  const [defaultModalVisible, setDefaultModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const { currentUser } = useContext(AuthApi.AuthContext);
  // First and subsequent refresh Functions //////////////////////////////////////////////////////
  useEffect(() => {
    mounted.current = true;
    if (currentUser.shippingAddress) {
      var i = 0;
      var addresses = [];
      currentUser.shippingAddress.forEach((address) => {
        if (address.isDefault == true) {
          setCurrentDefault(i);
        }
        addresses.push({
          //(push as an object)
          ...address,
          key: i.toString(), // key must be a string
        });

        i = i + 1;
      });

      if (mounted.current == true) {
        console.log("Addresses set");
        setShippings(addresses);
        setLoading(false);
      }
    } else {
      if (mounted.current == true) {
        console.log("No address");
        setShippings([]);
        setLoading(false);
      }
    }
    // unmounted
    return () => {
      mounted.current = false;
    };
  }, [currentUser]);

  ////////////////////////////////////////////////////////////////

  const handleSubmit = (address) => {
    setLoading(true);
    setAddModalVisible(false);
    addAddress(address);
  };

  const handleCancel = () => {
    setAddModalVisible(false);
  };

  const addAddress = (address) => {
    setLoading(true);
    console.log("Adding address");
    if (currentUser.shippingAddress) {
      // if it is not null
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          shippingAddress: firebase.firestore.FieldValue.arrayUnion({
            address: address.address,
            unitno: address.unitno,
            postal_code: address.postal_code,
            isDefault: false,
          }),
        })
        .then(() => {
          console.log("Added Shipping Address");
        })
        .catch((error) => {
          console.log(error.message);
          Alert.alert("Error", error.message);
          setLoading(false);
        });
    } else {
      // if it is null
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          shippingAddress: [
            {
              address: address.address,
              unitno: address.unitno,
              postal_code: address.postal_code,
              isDefault: true,
            },
          ],
        })
        .then(() => {
          console.log("Added Shipping Address");
        })
        .catch((error) => {
          console.log(error.message);
          Alert.alert("Error", error.message);
          setLoading(false);
        });
    }
  };
  //Deletion Functions////////////////////////////////////////////
  const handleDelete = (item) => {
    setLoading(true);
    deleteAddress(item.key);
  };

  const deleteAddress = (index) => {
    console.log("Deleting address");
    var updatedShippings = shippings;
    if (updatedShippings.length > 1) {
      // if array length is more than 1
      updatedShippings.splice(index, 1); // remove the indexed element
      updatedShippings[0].isDefault = true; // set 1st element as default regardless if it was or not
    } else updatedShippings = null;

    db.collection("users")
      .doc(currentUser.uid)
      .update({
        shippingAddress: updatedShippings,
      })
      .then(() => {
        console.log("Removed Address");
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      });
  };
  //////////////////////////////////////////////////////////

  // For setting address as default//////////////////////////////////
  const handleSetDefault = (item) => {
    setToBeDefault(item.key);
    setDefaultModalVisible(true);
  };

  const handleYes = () => {
    console.log("Setting as Default");
    setLoading(true);
    setDefaultModalVisible(false);
    var updatedShippings = shippings;
    updatedShippings[currentDefault].isDefault = false;
    updatedShippings[toBeDefault].isDefault = true;

    db.collection("users")
      .doc(currentUser.uid)
      .update({
        shippingAddress: updatedShippings,
      })
      .then(() => {
        console.log("Updated Default");
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      });
  };

  const handleNo = () => {
    setToBeDefault(null);
    setDefaultModalVisible(false);
  };

  //Renders footer for Flatlist/////////////////////
  const renderFooter = () => {
    return (
      shippings.length < 5 && (
        <>
          <ListItemSeperator />
          <ListItem
            IconComponent={
              <Icon
                name='plus-thick'
                backgroundColor={colors.white}
                iconColor='black'
              />
            }
            title='Add a new address'
            onPress={() => setAddModalVisible(true)}
            // onPress={() => console.log(shippings)}
          />
        </>
      )
    );
  };
  ////////////////////////////////////////////////////////////////

  return (
    <Screen style={{ paddingTop: 0, backgroundColor: colors.whitegrey }}>
      <AppActivityIndicator visible={loading} />

      <View style={styles.instruction}>
        <AppText style={{ color: colors.white, fontSize: 15 }}>
          Tap to set as default / Swipe left to delete
        </AppText>
      </View>
      <ListItemSeperator />
      <View
        style={{
          justifyContent: "center",
          backgroundColor: colors.white,
        }}
      >
        <AppText style={{ color: colors.black, fontSize: 15, padding: 5 }}>
          Shipping Addresses
        </AppText>
      </View>

      <ListItemSeperator />
      <FlatList
        data={shippings}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <AddressListItem
            title={item.address + ", #" + item.unitno}
            subTitle={item.isDefault == true && "Default"}
            bottomTitle={item.postal_code}
            onPress={() => {
              item.isDefault != true && handleSetDefault(item);
            }}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeperator}
      />
      {/* Modal for setting default */}
      <Modal transparent={true} visible={defaultModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalBoxContainer}>
            <View style={styles.switchTextContainer}>
              <AppText style={styles.switchText}>
                Set this address as default?
              </AppText>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableHighlight
                underlayColor={colors.sienna}
                activeOpacity={0.5}
                style={styles.buttonYesContainer}
                onPress={handleYes}
              >
                <AppText style={{ color: colors.darkorange }}>Yes</AppText>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={colors.brown}
                activeOpacity={0.5}
                style={styles.buttonNoContainer}
                onPress={handleNo}
              >
                <AppText style={{ color: colors.brightred }}>No</AppText>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal for form to add new address */}
      <Modal transparent={true} visible={addModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalBoxContainer2}>
            <AppForm
              initialValues={{
                address: "",
                unitno: "",
                postal_code: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppFormField
                autoCorrect={false}
                autoCompleteType='street-address'
                icon='home-edit'
                maxLength={40}
                multiline={true}
                name='address'
                placeholder='Address'
                textContentType='streetAddressLine1'
              />
              <AppFormField
                autoCorrect={false}
                autoCapitalize='none'
                icon='home-edit'
                maxLength={7}
                keyboardType='numeric'
                width='80%'
                name='unitno'
                placeholder='Unit No #'
              />
              <AppFormField
                autoCapitalize='none'
                autoCorrect={false}
                icon='home-edit'
                maxLength={6}
                keyboardType='numeric'
                width='80%'
                name='postal_code'
                placeholder='Postal Code'
                textContentType='postalCode'
              />
              <Error_Message error={error} visible={error} />
              <View style={{ marginVertical: 10, alignItems: "center" }}>
                <SubmitButton title='Add Address' />
                <View style={{ marginTop: 5 }}>
                  <TouchableHighlight
                    onPress={handleCancel}
                    underlayColor={colors.white}
                  >
                    <AppText
                      style={{ color: colors.muted, fontWeight: "bold" }}
                    >
                      Cancel
                    </AppText>
                  </TouchableHighlight>
                </View>
              </View>
            </AppForm>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  instruction: {
    backgroundColor: "#000000aa",
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
  },
  modalBoxContainer: {
    backgroundColor: colors.white,
    margin: 50,
    marginTop: 100,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalBoxContainer2: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 100,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  switchTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  switchText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.muted,
  },
  buttonYesContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderColor: colors.whitegrey,
    width: "50%",
  },
  buttonNoContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.whitegrey,
    width: "50%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    width: "100%",
    height: "40%",
  },
});

export default ShippingAddressesScreen;
