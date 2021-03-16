import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";

//import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/lists/ListItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItemSeperator from "../components/lists/ListItemSeperator";
//Navigation
import routes from "../navigation/routes";
// Back End
import AuthApi from "../api/auth";
import app from "../auth/base.js";

const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.brightred,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.cyan,
    },
    targetScreen: routes.MESSAGES,
  },
];

function AccountScreen({ navigation }) {
  // since this is a Stack.Screen, it has access to {navigation} prop

  // uses custom hook "useAuth" from useAuth.js to perform useContext(AuthContext);
  const {
    currentUser,
    isLoading,
    setIsLoading,
    guestMode,
    setGuestMode,
  } = useContext(AuthApi.AuthContext);

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
  const handleLogout = async () => {
    setIsLoading(true);
    app.auth().signOut();
  };

  const handleBackToWelcome = () => {
    setGuestMode(false);
  };
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={currentUser ? currentUser.displayName : "Guest"}
          subTitle={currentUser ? currentUser.email : "No Email"}
          image={
            currentUser && currentUser.photoURL
              ? currentUser.photoURL // user's profile picture
              : require("../assets/default-profile-pic.jpg") // default profile picture
          }
          border={true}
          defaultimage={currentUser && currentUser.photoURL ? false : true}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.title}
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
      </View>
      {!isLoading ? (
        guestMode ? (
          <ListItem
            title='Back to Welcome Screen'
            IconComponent={
              <Icon name='logout' backgroundColor='#ffe66d' iconColor='black' />
            }
            onPress={handleBackToWelcome} // call for function to handle logout process
          />
        ) : (
          <ListItem
            title='Log Out'
            IconComponent={
              <Icon name='logout' backgroundColor='#ffe66d' iconColor='black' />
            }
            onPress={handleLogout} // call for function to handle logout process
          />
        )
      ) : (
        <ListItem
          title='Log Out'
          IconComponent={
            <Icon name='logout' backgroundColor='#ffe66d' iconColor='black' />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  screen: {
    backgroundColor: colors.whitegrey,
  },
});
export default AccountScreen;
