import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";

import ListItemSeperator from "../components/lists/ListItemSeperator";
import AppText from "../components/AppText";
import colors from "../config/colors";
import AppActivityIndicator from "../components/AppActivityIndicator";
import ImageInputAM from "../components/ImageInputAM";
import AccountMInputModal from "../components/AccountMInputModal";
import AuthenticateInputModal from "../components/AuthenticateInputModal";
import BankAccountInputModal from "../components/BankAccountInputModal";
import StoreAddressInputModel from "../components/StoreAddressInputModel";
import AuthenticateAndChangePasswordInputModal from "../components/AuthenticateAndChangePasswordInputModal";
import AuthenticateAndDeleteModal from "../components/AuthenticateAndDeleteModal";
import AuthenticateAndDeleteModal2 from "../components/AuthenticateAndDeleteModal2";
import AuthenticateAndDeleteModal3 from "../components/AuthenticateAndDeleteModal3";
import ListItem from "../components/lists/ListItem";
import AccountMListItem from "../components/lists/AccountMListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//Navigation
import routes from "../navigation/routes";
// Back End
import AuthApi from "../api/auth";
import axios from "axios";

function AccountManagementScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [email, setEmail] = useState(null);
  const [first_name, setFirst_name] = useState(null);
  const [last_name, setLast_name] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [localImage, setLocalImage] = useState(false);
  const [fourD, setFourD] = useState(0);
  const [bank_id, setBank_id] = useState(null);
  const [store_address, setStore_address] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [secretModalVisible, setSecretModalVisible] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [closeModalVisible2, setCloseModalVisible2] = useState(false);
  const [closeModalVisible3, setCloseModalVisible3] = useState(false);
  const [focusField, setFocusField] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (currentUser.isMerchant == true) {
      axios({
        method: "POST",
        url:
          "https://us-central1-buyfne-63905.cloudfunctions.net/retreiveBankAccount",
        data: {
          stripe_id: currentUser.stripe_id,
        },
      })
        .then(({ _, data }) => {
          setFourD(data.data[0].last4);
          setBank_id(data.data[0].id);
          setProfilePic(currentUser.profilePic);
          setEmail(currentUser.email);
          setFirst_name(currentUser.first_name);
          setLast_name(currentUser.last_name);
          setDisplayName(currentUser.displayName);
          retrieveStoreAddress();
        })
        .catch((error) => {
          console.log("Error : ", error.message);
          Alert.alert("Error", error.message);
          setLoading(false);
        });
    } else {
      setProfilePic(currentUser.profilePic);
      setEmail(currentUser.email);
      setFirst_name(currentUser.first_name);
      setLast_name(currentUser.last_name);
      setDisplayName(currentUser.displayName);
      setLoading(false);
    }
  }, []);

  const retrieveStoreAddress = () => {
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/retrieveStoreAddress",
      data: {
        stripe_id: currentUser.stripe_id,
      },
    })
      .then(({ _, data }) => {
        console.log(data.individual.address);
        setStore_address(data.individual.address);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      });
  };

  return (
    <>
      <AppActivityIndicator visible={loading} />
      {currentUser && (
        <ScrollView>
          <Screen style={{ paddingTop: 0, backgroundColor: colors.whitegrey }}>
            {/* Profile Pic */}
            <View style={styles.instruction}>
              <AppText style={{ color: colors.white, fontSize: 15 }}>
                Tap to edit
              </AppText>
            </View>

            <View
              style={{
                backgroundColor: colors.orange,
                paddingTop: 15,
                paddingBottom: 5,
                alignItems: "center",
              }}
            >
              <ImageInputAM
                imageUri={profilePic}
                localImage={localImage}
                onChangeImage={(image) => {
                  setProfilePic(image);
                  setLocalImage(true);
                }}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.orange,
                flexDirection: "row",
                paddingBottom: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setProfilePic(currentUser.profilePic);
                  setLocalImage(false);
                }}
                style={{ marginRight: 10 }}
              >
                <MaterialCommunityIcons
                  name='refresh-circle'
                  size={25}
                  color={colors.muted}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (currentUser.profilePic) {
                    setProfilePic(null);
                    setLocalImage(true);
                  } else {
                    setProfilePic(null);
                    setLocalImage(false);
                  }
                }}
              >
                <MaterialCommunityIcons
                  name='close-circle'
                  size={25}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                My Account
              </AppText>
            </View>
            {/* Email */}
            <ListItemSeperator />
            <AccountMListItem
              title={"Email:   " + email}
              style={{ paddingLeft: 0 }}
              textStyle={{ fontSize: 15 }}
              onPress={() => {
                setFocusField("Email");
                setModalVisible(true);
              }}
            />
            {/* First Name */}
            <ListItemSeperator />
            <AccountMListItem
              title={"First Name:   " + first_name}
              style={{ paddingLeft: 0 }}
              textStyle={{ fontSize: 15 }}
              onPress={() => {
                setFocusField("First Name");
                setModalVisible(true);
              }}
            />
            {/* Last Name */}
            <ListItemSeperator />
            <AccountMListItem
              title={"Last Name:   " + last_name}
              style={{ paddingLeft: 0 }}
              textStyle={{ fontSize: 15 }}
              onPress={() => {
                setFocusField("Last Name");
                setModalVisible(true);
              }}
            />
            {/* Display Name */}
            <ListItemSeperator />
            <AccountMListItem
              title={"Display Name:   " + displayName}
              style={{ paddingLeft: 0 }}
              textStyle={{ fontSize: 15 }}
              onPress={() => {
                setFocusField("Display Name");
                setModalVisible(true);
              }}
            />
            {/* Date of Birth */}
            <ListItemSeperator />
            <AccountMListItem
              title={
                "Date of Birth:   " +
                (currentUser.dob_day < 10
                  ? "0" + currentUser.dob_day
                  : currentUser.dob_day) +
                "/" +
                (currentUser.dob_month < 10
                  ? "0" + currentUser.dob_month
                  : currentUser.dob_month) +
                "/" +
                currentUser.dob_year
              }
              style={{ paddingLeft: 0 }}
              textStyle={{ color: colors.muted, fontSize: 15 }}
            />
            <ListItemSeperator />
            {/* Save Changes button */}
            <View style={{ alignItems: "center" }}>
              <AppButton
                title='Save Changes'
                icon='content-save'
                color='brightred'
                style={{
                  width: "50%",
                  marginVertical: 20,
                  paddingVertical: 10,
                }}
                onPress={() => {
                  setAuthModalVisible(true);
                }}
              />
            </View>
            <ListItemSeperator />
            <View style={{ marginBottom: 50 }}>
              <ListItem
                title='Change Password'
                style={{ paddingLeft: 0 }}
                onPress={() => {
                  setSecretModalVisible(true);
                }}
              />

              {currentUser.type == 3 && (
                <View style={{ alignItems: "center" }}>
                  <AppButton
                    title='Close Account'
                    color='danger'
                    style={{
                      paddingVertical: 10,
                      marginTop: 20,
                      width: "70%",
                    }}
                    onPress={() => setCloseModalVisible3(true)}
                  />
                </View>
              )}
              {currentUser.type != 3 && (
                <>
                  <ListItemSeperator />
                  <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
                    <AppText style={{ color: colors.muted, fontSize: 15 }}>
                      Checkout Details
                    </AppText>
                  </View>
                  {/* Address */}
                  <ListItemSeperator />
                  <ListItem
                    title='Shipping Addresses'
                    style={{ paddingLeft: 0 }}
                    onPress={() =>
                      navigation.navigate(routes.SHIPPINGADDRESSES)
                    }
                  />
                  <ListItemSeperator />

                  {/* Payment Info */}
                  <ListItem
                    title='Shopper Payment Details'
                    style={{ paddingLeft: 0 }}
                    onPress={() => navigation.navigate(routes.PAYMENTDETAILS)}
                  />
                  <ListItemSeperator />
                  {currentUser.isMerchant != true && (
                    <View style={{ alignItems: "center" }}>
                      <AppButton
                        title='Close Account'
                        color='danger'
                        style={{
                          paddingVertical: 10,
                          marginTop: 20,
                          width: "70%",
                        }}
                        onPress={() => setCloseModalVisible(true)}
                      />
                    </View>
                  )}
                </>
              )}
              {/* Merchant Information */}

              {currentUser.isMerchant == true && (
                <View>
                  {/* Section Title */}
                  <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
                    <AppText style={{ color: colors.muted, fontSize: 15 }}>
                      Merchant Details
                    </AppText>
                  </View>
                  <View style={styles.container}>
                    <View style={styles.detailsContainer}>
                      <AppText style={styles.title} numberOfLines={1}>
                        {"Store Name:   " + currentUser.store_name}
                      </AppText>
                    </View>
                  </View>
                  <ListItemSeperator />
                  <ListItem
                    title={"Bank Account:   " + "********" + fourD}
                    style={{ paddingLeft: 0 }}
                    onPress={() => {
                      setBankModalVisible(true);
                    }}
                  />
                  <ListItemSeperator />
                  <ListItem
                    title='Merchant Store Address'
                    style={{ paddingLeft: 0 }}
                    onPress={() => {
                      setAddressModalVisible(true);
                    }}
                  />
                  <ListItemSeperator />
                  <View style={{ alignItems: "center" }}>
                    <AppButton
                      title='Close Account'
                      color='danger'
                      style={{
                        paddingVertical: 10,
                        marginTop: 20,
                        width: "70%",
                      }}
                      onPress={() => setCloseModalVisible2(true)}
                    />
                  </View>
                </View>
              )}
            </View>
          </Screen>
        </ScrollView>
      )}
      <AccountMInputModal
        visible={modalVisible}
        onPress={() => setModalVisible(false)}
        name={focusField}
        onApply={(value) => {
          if (focusField == "Email") {
            setEmail(value);
            setModalVisible(false);
          } else if (focusField == "First Name") {
            setFirst_name(value);
            setModalVisible(false);
          } else if (focusField == "Last Name") {
            setLast_name(value);
            setModalVisible(false);
          } else if (focusField == "Display Name") {
            setDisplayName(value);
            setModalVisible(false);
          } else {
            console.log("no field focused");
            setModalVisible(false);
          }
        }}
      />
      <AuthenticateInputModal
        visible={authModalVisible}
        profilePic={profilePic}
        localImage={localImage}
        email={email}
        first_name={first_name}
        last_name={last_name}
        displayName={displayName}
        onPress={() => {
          setAuthModalVisible(false);
        }}
      />

      <AuthenticateAndChangePasswordInputModal
        visible={secretModalVisible}
        onPress={() => {
          setSecretModalVisible(false);
        }}
      />

      <BankAccountInputModal
        visible={bankModalVisible}
        bank_id={bank_id}
        onPress={() => {
          setBankModalVisible(false);
        }}
        onExit={(last4, bank_id) => {
          setFourD(last4);
          setBank_id(bank_id);
          setBankModalVisible(false);
        }}
      />
      <StoreAddressInputModel
        visible={addressModalVisible}
        old_store_address={store_address}
        onPress={() => {
          setAddressModalVisible(false);
        }}
        onExit={(address) => {
          setStore_address(address);
          setAddressModalVisible(false);
        }}
      />
      <AuthenticateAndDeleteModal
        visible={closeModalVisible}
        onPress={() => {
          setCloseModalVisible(false);
        }}
        navigation={navigation}
      />
      <AuthenticateAndDeleteModal2
        visible={closeModalVisible2}
        onPress={() => {
          setCloseModalVisible2(false);
        }}
        navigation={navigation}
      />
      <AuthenticateAndDeleteModal3
        visible={closeModalVisible3}
        onPress={() => {
          setCloseModalVisible3(false);
        }}
        navigation={navigation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  instruction: {
    backgroundColor: "#000000aa",
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  instruction2: {
    backgroundColor: colors.teal,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    paddingLeft: 0,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    color: colors.muted,
  },
});

export default AccountManagementScreen;
