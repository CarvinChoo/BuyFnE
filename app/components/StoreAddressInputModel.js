import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-native";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import AppButton from "./AppButton";
import Screen from "./Screen";
import AppTextInput from "./AppTextInput";
import { Error_Message } from "./forms";
import { Alert } from "react-native";
import AppActivityIndicator from "./AppActivityIndicator";
// Back End
import AuthApi from "../api/auth";
import axios from "axios";
import AppText from "./AppText";

function StoreAddressInputModel({
  visible,
  old_store_address,
  onPress,
  onExit,
}) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [error, setError] = useState(null);
  const [store_address, setStore_address] = useState("");
  const [store_unitno, setStore_unitno] = useState("");
  const [postal_code, setPostal_code] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (old_store_address) {
      setStore_address(old_store_address.line1);
      setStore_unitno(old_store_address.line2);
      setPostal_code(old_store_address.postal_code);
    }
    setError(null);
  }, [visible]);

  const validatePostal = (postal_code) => {
    const re = /^[0-9]{6,6}$/;
    return re.test(postal_code);
  };

  const saveChanges = () => {
    setLoading(true);
    if (
      store_address.length > 0 &&
      store_unitno.length > 0 &&
      postal_code > 0
    ) {
      if (validatePostal(postal_code)) {
        setError(null);
        updateStoreAddress();
      } else {
        setError("Postal code must be exactly 6 digits");
        setLoading(false);
      }
    } else {
      setError("Please fill up all fields");
      setLoading(false);
    }
  };

  const updateStoreAddress = () => {
    onPress();
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/updateStoreAddress",
      data: {
        stripe_id: currentUser.stripe_id,
        store_address: store_address,
        store_unitno: store_unitno,
        postal_code: postal_code,
      },
    })
      .then(({ _, data }) => {
        Alert.alert(
          "Changes Saved",
          "Changes has been successfully saved and updated."
        );
        console.log(data.individual.address);
        onExit(data.individual.address);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(
          "Failed to update store address using information provided",
          error.message
        );
      });
  };

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Modal visible={visible}>
        <Screen style={{ backgroundColor: colors.whitegrey, paddingTop: 0 }}>
          <Button title='close' onPress={onPress} />
          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <View style={{ alignItems: "flex-start" }}>
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                Store Address
              </AppText>
            </View>

            <AppTextInput
              color={colors.white}
              placeholder='Store Address'
              value={store_address}
              onChangeText={(secret) => {
                setStore_address(secret);
              }}
            />
            <View style={{ alignItems: "flex-start" }}>
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                Unit No.
              </AppText>
            </View>
            <AppTextInput
              color={colors.white}
              placeholder='Unit No.'
              value={store_unitno}
              onChangeText={(secret) => {
                setStore_unitno(secret);
              }}
            />
            <View style={{ alignItems: "flex-start" }}>
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                Postal Code
              </AppText>
            </View>
            <AppTextInput
              color={colors.white}
              value={postal_code}
              placeholder='Postal Code'
              onChangeText={(secret) => {
                setPostal_code(secret);
              }}
              maxLength={6}
            />
            <View style={{ alignItems: "center" }}>
              <Error_Message error={error} visible={error} />
              <AppButton
                color={!loading ? "brightred" : "grey"}
                title='Save Changes'
                style={{ width: "50%", padding: 10 }}
                onPress={() => saveChanges()}
              />
            </View>
          </View>
        </Screen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default StoreAddressInputModel;
