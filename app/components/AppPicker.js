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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import colors from "../config/colors";
import defaultStyles from "../config/styles";
import Screen from "./Screen";
import AppText from "./AppText";
import PickerItem from "./PickerItem";

function AppPicker({
  icon,
  items,
  numOfColumns = 1,
  selectedItem,
  PickerItemComponent = PickerItem,
  onSelectItem,
  placeholder,
  width = "100%",
}) {
  // Text box Bar with conditional icon and dynamic text rendering
  const [modalVisible, setModalVisible] = useState(false);
  return (
    // encase in React.Fragment but can just empty brackets to represent the same thing

    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={[styles.container, { width: width }]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={25}
              color={colors.muted}
              style={styles.icon}
            />
          )}
          {selectedItem ? (
            <AppText style={styles.text}>{selectedItem.label}</AppText>
          ) : (
            <AppText style={styles.placeholder}>{placeholder}</AppText>
          )}
          <MaterialCommunityIcons
            name='chevron-down'
            size={25}
            color={colors.muted}
          />
        </View>
      </TouchableWithoutFeedback>

      <Modal visible={modalVisible} animationType='slide'>
        <Screen style={{ paddingTop: 0 }}>
          <Button title='Close' onPress={() => setModalVisible(false)} />
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            numColumns={numOfColumns} //determines how many columns to spread PickItems in
            renderItem={({ item }) => (
              <PickerItemComponent //depends on what PickerItemComponent was passed into current component
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

export default AppPicker;
