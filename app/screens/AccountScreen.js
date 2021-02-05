import React from "react";
import { StyleSheet, View, FlatList } from "react-native";

//import { FlatList } from "react-native-gesture-handler";
import ListItem from "../components/lists/ListItem";
import Screen from "../components/lists/Screen";
import colors from "../config/colors";
import Icon from "../components/lists/Icon";
import ListItemSeperator from "../components/lists/ListItemSeperator";

const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.brightred,
    },
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.cyan,
    },
  },
];

function AccountScreen(props) {
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title='Carvin Choo'
          subTitle='carvin.choo@gmail.com'
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
