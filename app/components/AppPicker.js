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

import colors from "../config/colors";
import defaultStyles from "../config/styles";
import Screen from "./Screen";
import AppText from "./AppText";
import PickerItem from "./PickerItem";

function AppPicker({ icon, items, selectedItem, onSelectItem, placeholder }) {
  // Text box Bar with conditional icon and dynamic text rendering
  const [modalVisible, setModalVisible] = useState(false);
  return (
    // encase in React.Fragment but can just empty brackets to represent the same thing
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={25}
              color={colors.muted}
              style={styles.icon}
            />
          )}
          {/* Renders placeholder if nothing selected, renders item name if selected */}
          <AppText style={styles.text}>
            {selectedItem ? selectedItem.label : placeholder}
          </AppText>
          <MaterialCommunityIcons
            name='chevron-down'
            size={25}
            color={colors.muted}
          />
        </View>
      </TouchableWithoutFeedback>

      <Modal // used to display List
        visible={modalVisible}
        animationType='slide'
      >
        <Screen // Screen component causing android to have addition header
          style={{ paddingTop: 0 }} // removes padding on top
        >
          <Button title='Close' onPress={() => setModalVisible(false)} />
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <PickerItem
                label={item.label}
                onPress={() => {
                  setModalVisible(false);
                  onSelectItem(item); //passes item into onSelectItem function which is done on App.js to set category state
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
});

export default AppPicker;
