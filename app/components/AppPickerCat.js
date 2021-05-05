import React, { useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";

import colors from "../config/colors";
import Screen from "./Screen";
import Icon from "./Icon";
import CategoryPickerItem from "./CategoryPickerItem";

function AppPickerCat({ items, numOfColumns = 1, onSelectItem }) {
  // Text box Bar with conditional icon and dynamic text rendering
  const [modalVisible, setModalVisible] = useState(false);
  return (
    // encase in React.Fragment but can just empty brackets to represent the same thing

    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderBottomLeftRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: colors.white,
            borderRightWidth: 1,
            borderRightColor: colors.muted,
          }}
        >
          <Icon
            name='view-list'
            backgroundColor={colors.white}
            iconColor={colors.muted}
            size={50}
          />
        </View>
      </TouchableWithoutFeedback>

      <Modal visible={modalVisible} animationType='slide'>
        <Screen style={{ paddingTop: 0 }}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                backgroundColor: colors.muted,
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.white, fontWeight: "bold" }}>
                Close
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            numColumns={numOfColumns} //determines how many columns to spread PickItems in
            renderItem={({ item }) => (
              <CategoryPickerItem //depends on what PickerItemComponent was passed into current component
                item={item}
                onPress={() => {
                  setModalVisible(false);
                  onSelectItem(item);
                }}
              />
            )}
          />
        </Screen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whitegrey,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    color: colors.muted,
  },
});

export default AppPickerCat;
