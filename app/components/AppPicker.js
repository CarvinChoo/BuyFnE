import React, { useState } from "react";
import {
  Button,
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

function AppPicker({ icon, placeholder, ...otherProps }) {
  //"...otherProps" copies all other properties given in the argument that isn't specified before
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
          <AppText style={styles.text}>{placeholder}</AppText>
          <MaterialCommunityIcons
            name='chevron-down'
            size={25}
            color={colors.muted}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType='slide'>
        {Platform.OS === "android" ? ( //because <Screen> causes android to have too much vertical margin
          <Button title='Close' onPress={() => setModalVisible(false)} />
        ) : (
          <Screen>
            <Button title='Close' onPress={() => setModalVisible(false)} />
          </Screen>
        )}
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
