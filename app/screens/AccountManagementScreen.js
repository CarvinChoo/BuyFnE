import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, View, ScrollView } from "react-native";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import AppTextInput from "../components/AppTextInput";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import AppText from "../components/AppText";
import colors from "../config/colors";
import ImageInputAM from "../components/ImageInputAM";
import AppActivityIndicator from "../components/AppActivityIndicator";
import ListItem from "../components/lists/ListItem";

//Navigation
import routes from "../navigation/routes";
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import axios from "axios";

function AccountManagementScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [fourD, setFourD] = useState(0);
  const [loading, setLoading] = useState(false);
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
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error : ", error.message);
          Alert.alert("Error", error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <ScrollView>
        <Screen style={{ paddingTop: 0, backgroundColor: colors.whitegrey }}>
          {/* Profile Pic */}

          <View
            style={{
              backgroundColor: colors.orange,

              alignItems: "center",
              padding: 15,
            }}
          >
            <ImageInputAM imageUri={currentUser.profilePic} />
          </View>
          {/* *****************REMOVE LATER******************* */}
          <View style={styles.instruction}>
            <AppText style={{ color: colors.white, fontSize: 15 }}>
              Edit image is work in progress dont click
            </AppText>
          </View>
          {/* ************************************************** */}
          <ListItemSeperator />
          <View style={styles.instruction}>
            <AppText style={{ color: colors.white, fontSize: 15 }}>
              Tap to edit
            </AppText>
          </View>
          <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
            <AppText style={{ color: colors.muted, fontSize: 15 }}>
              My Account
            </AppText>
          </View>
          {/* Email */}
          <ListItemSeperator />
          <ListItem
            title={"Email:   " + currentUser.email}
            style={{ paddingLeft: 0 }}
          />
          {/* First Name */}
          <ListItemSeperator />
          <ListItem
            title={"First Name:   " + currentUser.first_name}
            style={{ paddingLeft: 0 }}
          />
          {/* Last Name */}
          <ListItemSeperator />
          <ListItem
            title={"Last Name:   " + currentUser.last_name}
            style={{ paddingLeft: 0 }}
          />
          {/* Display Name */}
          <ListItemSeperator />
          <ListItem
            title={"Display Name:   " + currentUser.displayName}
            style={{ paddingLeft: 0 }}
          />
          {/* Date of Birth */}
          <ListItemSeperator />
          <ListItem
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
          />
          <ListItemSeperator />
          {/* Save Changes button */}
          <View style={{ alignItems: "center" }}>
            <AppButton
              title='Save Changes'
              icon='content-save'
              color='dimgrey'
              style={{
                width: "50%",
                marginVertical: 20,
                paddingVertical: 10,
              }}
            />
          </View>
          <ListItemSeperator />
          <View style={{ marginBottom: 100 }}>
            <ListItem title='Change Password' style={{ paddingLeft: 0 }} />
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
              onPress={() => navigation.navigate(routes.SHIPPINGADDRESSES)}
            />
            <ListItemSeperator />

            {/* Payment Info */}
            <ListItem
              title='Shopper Payment Details'
              style={{ paddingLeft: 0 }}
              onPress={() => navigation.navigate(routes.PAYMENTDETAILS)}
            />
            <ListItemSeperator />
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
                />
                <ListItemSeperator />
                <ListItem
                  title='Merchant Store Address'
                  style={{ paddingLeft: 0 }}
                />
                <ListItemSeperator />
              </View>
            )}
          </View>
        </Screen>
      </ScrollView>
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
