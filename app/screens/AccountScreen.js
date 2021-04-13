import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableHighlight,
  Alert,
} from "react-native";

//import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/lists/ListItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import AppActivityIndicator from "../components/AppActivityIndicator";
//Navigation
import routes from "../navigation/routes";
// Back End
import AuthApi from "../api/auth";
import app from "../auth/base.js";
import AppText from "../components/AppText";
import db from "../api/db";

const menuItemsGuest = [
  {
    title: "FAQ",
    icon: {
      name: "frequently-asked-questions",
      backgroundColor: colors.steelblue,
    },
    targetScreen: routes.MESSAGES,
  },
];

const menuItemsSeller = [
  {
    title: "My Listings",
    icon: {
      name: "storefront-outline",
      backgroundColor: colors.brightred,
    },
    targetScreen: routes.LISTINGSHISTORY,
  },
  {
    title: "Store Vouchers",
    icon: {
      name: "ticket-percent",
      backgroundColor: colors.green,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "Support Tickets",
    icon: {
      name: "email",
      backgroundColor: colors.cyan,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "FAQ",
    icon: {
      name: "frequently-asked-questions",
      backgroundColor: colors.steelblue,
    },
    targetScreen: routes.MESSAGES,
  },
];

const menuItemsBuyer = [
  {
    title: "Order History",
    icon: {
      name: "shopping",
      backgroundColor: colors.orangered,
    },
    targetScreen: routes.ORDERHISTORY,
  },
  {
    title: "GroupBuys",
    icon: {
      name: "account-group",
      backgroundColor: colors.darkorchid,
    },
    targetScreen: routes.MYGROUPBUYS,
  },
  {
    title: "Watchlist",
    icon: {
      name: "clipboard-list",
      backgroundColor: colors.midnightblue,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "Vouchers",
    icon: {
      name: "ticket-percent",
      backgroundColor: colors.green,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "Group Buy Loyalty Progress",
    icon: {
      name: "gift",
      backgroundColor: colors.plum,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "Support Tickets",
    icon: {
      name: "email",
      backgroundColor: colors.cyan,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "FAQ",
    icon: {
      name: "frequently-asked-questions",
      backgroundColor: colors.steelblue,
    },
    targetScreen: routes.MESSAGES,
  },
];

const menuItemsAdmin = [
  {
    title: "Pending Support Tickets",
    icon: {
      name: "ticket-account",
      backgroundColor: colors.lightseagreen,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "Support in Progress",
    icon: {
      name: "comment-account",
      backgroundColor: colors.dodgerblue,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "Suspend Users",
    icon: {
      name: "account-cancel",
      backgroundColor: colors.brightred,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "Delete Users",
    icon: {
      name: "account-off",
      backgroundColor: colors.darkred,
    },
    targetScreen: routes.MESSAGES,
  },
];

function AccountScreen({ navigation }) {
  // since this is a Stack.Screen, it has access to {navigation} prop

  // uses custom hook "useAuth" from useAuth.js to perform useContext(AuthContext);
  const { currentUser, userType, setUserType } = useContext(
    AuthApi.AuthContext
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  //Function to handle logout process
  const handleLogout = () => {
    app.auth().signOut();
  };

  const handleYes = () => {
    setLoading(true);
    setModalVisible(false);
    if (userType == 2) {
      console.log("switching to shopper");
      setUserType(1);
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          type: 1,
        })
        .then(() => {
          Alert.alert("Success", "Switched to Shopper");

          setLoading(false);
        })
        .catch((error) => {
          console.log(error.message);
          setUserType(2);
          Alert.alert("Error", "Can't switch due to error");

          setLoading(false);
        });
    } else {
      console.log("switching to merchant");
      setUserType(2);
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          type: 2,
        })
        .then(() => {
          Alert.alert("Success", "Switched to Merchant");

          setLoading(false);
        })
        .catch((error) => {
          console.log(error.message);
          setUserType(1);
          Alert.alert("Error", "Can't switch due to error");

          setLoading(false);
        });
    }
  };

  const handleNo = () => {
    setModalVisible(false);
  };
  const renderHeader = () => {
    return (
      <View style={styles.container}>
        <View>
          <ListItem
            title={currentUser ? currentUser.displayName : "Guest"}
            subTitle={currentUser ? currentUser.email : "No Email"}
            image={
              currentUser && currentUser.profilePic
                ? currentUser.profilePic // user's profile picture
                : require("../assets/default-profile-pic.jpg") // default profile picture
            }
            border={true}
            defaultimage={currentUser && currentUser.profilePic ? false : true}
            onPress={() => navigation.navigate(routes.ACCOUNTMANAGEMENT)}
          />
        </View>
        {currentUser && userType == 1 && currentUser.isMerchant == false && (
          <View style={{ marginTop: 20 }}>
            <ListItem
              title='Sign up as merchant?'
              IconComponent={
                <Icon
                  name='storefront'
                  backgroundColor={colors.deepskyblue}
                  iconColor='black'
                />
              }
              onPress={() => navigation.navigate(routes.MERCHANTREGISTER)} // call for function to handle logout process
            />
          </View>
        )}
        {currentUser && currentUser.isMerchant == true && (
          <View style={{ marginTop: 20 }}>
            <ListItem
              title={userType == 1 ? "Switch to Merchant" : "Switch to Shopper"}
              IconComponent={
                <Icon
                  name={userType == 1 ? "store" : "shopping"}
                  backgroundColor={colors.darkgoldenrod}
                  iconColor='black'
                />
              }
              onPress={() => setModalVisible(true)} // call for function to handle logout process
            />
          </View>
        )}
        {/* Issue Voucher */}
        {userType == 3 && (
          <View style={{ marginTop: 20 }}>
            <ListItem
              title='Active Vouchers'
              IconComponent={
                <Icon name='ticket-percent' backgroundColor={colors.green} />
              }
              onPress={() => navigation.navigate(routes.MESSAGES)}
            />
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <>
        {currentUser && (
          <View style={styles.container}>
            <ListItem
              title='Log Out'
              IconComponent={
                <Icon
                  name='logout'
                  backgroundColor='#ffe66d'
                  iconColor='black'
                />
              }
              onPress={handleLogout} // call for function to handle logout process
            />
          </View>
        )}
      </>
    );
  };

  return (
    <Screen style={styles.screen}>
      <AppActivityIndicator // Loading Screen when processing registration with Firebase
        visible={loading}
      />
      <FlatList
        data={
          userType == 1
            ? menuItemsBuyer
            : userType == 2
            ? menuItemsSeller
            : userType == 3
            ? menuItemsAdmin
            : menuItemsGuest
        }
        keyExtractor={(item) => item.title}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            IconComponent={
              <Icon
                name={item.icon.name}
                backgroundColor={item.icon.backgroundColor}
              />
            }
            onPress={() => navigation.navigate(item.targetScreen)}
          />
        )}
        ItemSeparatorComponent={ListItemSeperator}
      />
      {/* Pop up to switch account function */}
      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalBoxContainer}>
            <View style={styles.switchTextContainer}>
              <AppText style={styles.switchText}>Switch to Shopper?</AppText>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableHighlight
                style={styles.buttonYesContainer}
                onPress={handleYes}
              >
                <AppText style={{ color: colors.darkorange }}>Yes</AppText>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.buttonNoContainer}
                onPress={handleNo}
              >
                <AppText style={{ color: colors.brightred }}>No</AppText>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  screen: {
    backgroundColor: colors.whitegrey,
    paddingTop: 0,
    marginBottom: 20,
  },
  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
  },
  modalBoxContainer: {
    backgroundColor: colors.white,
    margin: 50,
    marginTop: 100,
    height: "20%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
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
export default AccountScreen;
