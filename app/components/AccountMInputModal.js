import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-native";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import AppTextInput from "../components/AppTextInput";
import { Error_Message } from "./forms";

function AccountMInputModal({ visible, onPress, onApply, name = "Email" }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  const validateLength = (value) => {
    return value.length <= 20 && value.length > 0;
  };
  useEffect(() => {
    setValue("");
    setError(null);
  }, [visible]);
  return (
    <Modal visible={visible}>
      <Screen style={{ backgroundColor: colors.whitegrey, paddingTop: 0 }}>
        <Button title='close' onPress={onPress} />
        <View style={{ paddingHorizontal: 30, alignItems: "center" }}>
          <AppTextInput
            color={colors.white}
            placeholder={name}
            onChangeText={(text) => {
              setValue(text);
            }}
          />
          <Error_Message error={error} visible={error} />
          <AppButton
            title='Apply'
            style={{ width: "40%", padding: 10 }}
            onPress={() =>
              name == "Email"
                ? validateEmail(value)
                  ? (setError(null), onApply(value))
                  : setError("This is not an Email")
                : validateLength(value)
                ? (setError(null), onApply(value))
                : setError("Please enter input and keep it under 20 characters")
            }
          />
        </View>
      </Screen>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AccountMInputModal;
