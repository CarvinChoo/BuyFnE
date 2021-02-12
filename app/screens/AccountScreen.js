import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";

//import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/lists/ListItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import routes from "../navigation/routes";
import useAuth from "../auth/useAuth";

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
  const { user, logOut } = useAuth(); //returns user and setUser state from App.js parent component

  //Function to handle logout process
  const handleLogout = () => {
    logOut(); // calls custom hook function from useAuth.js to perform setUser(null) and remove token from cache
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.name}
          subTitle={user.email}
          image={require("../assets/HnMlogo.png")}
          border={true}
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
      <ListItem
        title='Log Out'
        IconComponent={
          <Icon name='logout' backgroundColor='#ffe66d' iconColor='black' />
        }
        onPress={handleLogout} // call for function to handle logout process
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
  },
});
export default AccountScreen;
