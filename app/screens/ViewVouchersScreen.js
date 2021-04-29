import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Image } from "react-native";
import { StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { Alert } from "react-native";
import VoucherListItem from "../components/VoucherListItem";
import {
  AppForm,
  AppSquareFormField,
  AppFormPicker,
  SubmitButton,
  Error_Message,
  AppExpiryPicker,
} from "../components/forms";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import * as Yup from "yup";
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import * as firebase from "firebase";
//Navigation
import AppActivityIndicator from "../components/AppActivityIndicator";
const validationSchema = Yup.object().shape({
  voucher_code: Yup.string()
    .required("Type a voucher code")
    .label("Voucher Code"),
});

function ViewVouchersScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    console.log("Voucher mounted");
    setLoading(true);
    if (currentUser.vouchers) {
      const promises = [];
      const voucherlist = [];
      const notExpired = []; //track not expired vouchers
      currentUser.vouchers.forEach((voucher_id) => {
        //individually retrieve each voucher info
        promises.push(
          db
            .collection("vouchers")
            .doc(voucher_id)
            .get()
            .then((e) => {
              if (e.exists) {
                voucherlist.push({
                  ...e.data(),
                });
                notExpired.push(voucher_id);
              }
            })
            .catch((error) => {
              console.log(error.message);
            })
        );
      });
      //Make sure each voucher is retreived
      Promise.all(promises)
        .then(() => {
          db.collection("users") //used to remove expired vouchers from user 's list
            .doc(currentUser.uid)
            .update({
              vouchers: notExpired,
            })
            .then(() => {
              setVouchers(voucherlist);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err.message);
              setVouchers(voucherlist);
              setLoading(false);
            });
        })
        .catch((err) => {
          setVouchers([]);
          Alert.alert("Error", "Fail to retreive vouchers");
          console.log(err.message);
          setLoading(false);
        });
    } else {
      setVouchers([]);
      setLoading(false);
    }
  }, [refresh]);

  const handleSubmit = (voucher) => {
    if (currentUser.vouchers) {
      setLoading(true);
      db.collection("vouchers")
        .where("voucher_code", "==", voucher.voucher_code)
        .limit(1)
        .get()
        .then((query) => {
          if (query.empty) {
            setError("There is no such voucher");
            setLoading(false);
          } else {
            setError(null);
            query.forEach((evoucher) => {
              if (currentUser.vouchers.includes(evoucher.data().voucher_id)) {
                setError("Already own this voucher");
                setLoading(false);
              } else if (
                currentUser.used_vouchers &&
                currentUser.used_vouchers.includes(evoucher.data().voucher_id)
              ) {
                setError("Already own and used this voucher");
                setLoading(false);
              } else {
                if (evoucher.data().seller_id != currentUser.uid) {
                  db.collection("users")
                    .doc(currentUser.uid)
                    .update({
                      vouchers: firebase.firestore.FieldValue.arrayUnion(
                        evoucher.data().voucher_id
                      ),
                    })
                    .then(() => {
                      Alert.alert("Success", "Added voucher to your vouchers");
                      setRefresh((refresh) => {
                        refresh + 1;
                      });
                    })
                    .catch((err) => {
                      setError(null);
                      console.log(err.message);
                      Alert.alert(
                        "Error communicating with database",
                        "Retry again later"
                      );
                      setLoading(false);
                    });
                } else {
                  setError("Cannot add your store's voucher.");
                  setLoading(false);
                }
              }
            });
          }
        })
        .catch((err) => {
          setError(null);
          console.log(err.message);
          Alert.alert("Error communicating with database", "Retry again later");
          setLoading(false);
        });
    } else {
      setLoading(true);
      db.collection("vouchers")
        .where("voucher_code", "==", voucher.voucher_code)
        .get()
        .then((query) => {
          if (query.empty) {
            setError("There is no such voucher");
            setLoading(false);
          } else {
            setError(null);
            query.forEach((evoucher) => {
              if (
                currentUser.used_vouchers &&
                currentUser.used_vouchers.includes(evoucher.data().voucher_id)
              ) {
                setError("Already redeemed this voucher");
                setLoading(false);
              } else if (evoucher.data().seller_id != currentUser.uid) {
                db.collection("users")
                  .doc(currentUser.uid)
                  .update({
                    vouchers: [evoucher.data().voucher_id],
                  })
                  .then(() => {
                    Alert.alert("Success", "Added voucher to your vouchers");
                    setRefresh((refresh) => {
                      refresh + 1;
                    });
                  })
                  .catch((err) => {
                    setError(null);
                    console.log(err.message);
                    Alert.alert(
                      "Error communicating with database",
                      "Retry again later1"
                    );
                    setLoading(false);
                  });
              } else {
                setError("Cannot add your store's voucher.");
                setLoading(false);
              }
            });
          }
        })
        .catch((err) => {
          setError(null);
          console.log(err.message);
          Alert.alert(
            "Error communicating with database",
            "Retry again later2"
          );
        });
      setLoading(false);
    }
  };
  const renderFooter = () => {
    return (
      <>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <AppForm
            initialValues={{
              voucher_code: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <AppSquareFormField
              name='voucher_code'
              maxLength={8}
              placeholderTitle='Voucher Code'
              placeholder='Type Here'
            />
            <Error_Message error={error} visible={error} />
            <SubmitButton
              title='Add Voucher'
              style={{
                width: "50%",
                backgroundColor: colors.teal,
                height: "35%",
              }}
            />
          </AppForm>
        </View>
      </>
    );
  };
  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Screen style={{ backgroundColor: colors.whitegrey, paddingTop: 0 }}>
        <FlatList
          data={vouchers}
          keyExtractor={(item) => item.voucher_id}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => <VoucherListItem item={item} />}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white },
  image: { height: 110, width: 110, resizeMode: "center" },
});

export default ViewVouchersScreen;
