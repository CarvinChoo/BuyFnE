import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import AppText from "./AppText";

function SwitchModal({ visible }) {
  return (
    <Modal transparent={true} visible={visible}>
      <View
        style={{
          backgroundColor: "#000000aa",
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            margin: 50,
            marginTop: 100,
            height: "20%",
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <AppText
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.muted,
              }}
            >
              Switch to Shopper?
            </AppText>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: "40%",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderTopWidth: 2,
                borderColor: colors.whitegrey,
                width: "50%",
              }}
            >
              <AppText style={{ color: colors.darkorange }}>Yes</AppText>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderTopWidth: 2,
                borderLeftWidth: 2,
                borderColor: colors.whitegrey,
                width: "50%",
              }}
            >
              <AppText style={{ color: colors.brightred }}>No</AppText>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SwitchModal;
