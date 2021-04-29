import React from "react";
import { TouchableHighlight } from "react-native";
import { Modal } from "react-native";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function PromptModal({ title, visible = false, handleYes, handleNo }) {
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.modal}>
        <View style={styles.modalBoxContainer}>
          <View style={styles.switchTextContainer}>
            <AppText style={styles.switchText}>{title}</AppText>
          </View>
          <View style={styles.modalButtonContainer}>
            <TouchableHighlight
              underlayColor={colors.sienna}
              activeOpacity={0.5}
              style={styles.buttonYesContainer}
              onPress={handleYes}
            >
              <AppText style={{ color: colors.darkorange }}>Confirm</AppText>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={colors.brown}
              activeOpacity={0.5}
              style={styles.buttonNoContainer}
              onPress={handleNo}
            >
              <AppText style={{ color: colors.brightred }}>Cancel</AppText>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
  },
  modalBoxContainer: {
    backgroundColor: colors.white,
    margin: 50,
    marginTop: 100,
    height: "30%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 20,
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
    height: "25%",
  },
});

export default PromptModal;
