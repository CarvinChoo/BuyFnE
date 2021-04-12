import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Image, SafeAreaView } from "react-native";

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
  const { currentUser, userType, setLoggedIn } = useContext(
    AuthApi.AuthContext
  );

  //Used to grab image from cloud storage///////////////////////////////////////////////
  // useEffect(() => {
  //   var ref = filestorage.ref().child(currentUser.uid + "/profilePicture.jpeg");
  //   ref.getDownloadURL().then((url) => {
  //     // `url` is the download URL for 'currentUser.uid + "/profilePicture.jpeg"'
  //     // Used local state to set profile picture url
  //     setProfilePic(url);
  //   });
  // }, []);

  //Function to handle logout process
  const handleLogout = () => {
    app.auth().signOut();
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
      currentUser && (
        <View style={styles.container}>
          <ListItem
            title='Log Out'
            IconComponent={
              <Icon name='logout' backgroundColor='#ffe66d' iconColor='black' />
            }
            onPress={handleLogout} // call for function to handle logout process
          />
        </View>
      )
    );
  };

  return (
    <Screen style={styles.screen}>
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
});
export default AccountScreen;
