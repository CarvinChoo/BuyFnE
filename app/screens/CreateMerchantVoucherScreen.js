import React, { useContext, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View, Switch } from "react-native";
import * as Yup from "yup";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import {
  AppForm,
  AppSquareFormField,
  AppFormPicker,
  SubmitButton,
  Error_Message,
  AppExpiryPicker,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import colors from "../config/colors";
import AppTextInput2 from "../components/AppTextInput2";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";

// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import * as firebase from "firebase";

const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const validationSchema = Yup.object().shape(
  {
    percentage_discount: Yup.number().when("amount_discount", {
      is: (amount_discount) => amount_discount <= 0,
      then: Yup.number()
        .required()
        .integer()
        .min(1, "Require minimum of at least 1%")
        .max(99, "Maximum of 99%")
        .label("Discount(%)"),
      otherwise: Yup.number().integer().min(0).max(99).label("Discount(%)"),
    }),
    amount_discount: Yup.number().when("percentage_discount", {
      is: 0,
      then: Yup.number()
        .required()
        .integer()
        .min(1, "Require minimum of at least $1")
        .max(10000, "Maximum of  $10000")
        .label("Discount($)"),
      otherwise: Yup.number().integer().min(0).label("Discount($)"), // maximum is around 2 months
    }),

    expiry_date: Yup.string()
      .required("Expiry Date is required")
      .label("Expiry Date"),

    minimum_spending: Yup.number()
      .integer()
      .min(0, "Set to 0 to indicate no minimum spending")
      .label("Minimum order for Group Buy"),

    voucher_code: Yup.string()
      .required("Voucher Code is required")
      .test("len", "Must be exactly 8 characters", (val) =>
        val == null ? val != null : val.length === 8
      )
      .matches(
        /^[a-z0-9]+$/i,
        "Only alphabets and numbers are allowed for this field "
      )
      .label("Voucher Code"),
  },
  [["amount_discount", "percentage_discount"]]
);

function CreateMerchantVoucherScreen(props) {
  // const [uploadVisible, setUploadVisible] = useState(false);
  // const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(true);

  const handleSubmit = (voucher, { resetForm }) => {
    setLoading(true);
    db.collection("vouchers")
      .where("voucher_code", "==", voucher.voucher_code)
      .limit(1)
      .get()
      .then((query) => {
        if (query.empty) {
          setError(null);
          if (percent) {
            voucher.amount_discount = null;
          } else {
            voucher.percentage_discount = null;
          }
          createNewVoucher(voucher, resetForm);
        } else {
          setError("Voucher Code is already in use.");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert(
          "Error communicating with database",
          "Fail to create voucher"
        );
      });
  };

  const createNewVoucher = (voucher, resetForm) => {
    const expiryparse = new Date(JSON.parse(voucher.expiry_date));
    const expiry_date_string =
      expiryparse.getDate() +
      " " +
      month[expiryparse.getMonth()] +
      " " +
      expiryparse.getFullYear();
    const expiry = firebase.firestore.Timestamp.fromDate(expiryparse);

    const ref = db.collection("vouchers").doc();
    ref
      .set({
        created_at: firebase.firestore.Timestamp.now(),
        voucher_id: ref.id,
        percentage_discount: Number(voucher.percentage_discount),
        amount_discount: Number(voucher.amount_discount),
        minimum_spending: Number(voucher.minimum_spending),
        seller_id: currentUser.uid,
        store_name: currentUser.store_name,
        store_logo: currentUser.store_logo,
        expiry_date: expiry,
        expiry_date_string: expiry_date_string,
        voucher_code: voucher.voucher_code,
        category: null,
        percent: percent,
      })
      .then(() => {
        Alert.alert("Success", "Created a new voucher for your store");
        resetForm();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert(
          "Error communicating with database",
          "Fail to create voucher"
        );
      });
  };

  const toggleSwitch = () => setPercent((previousState) => !previousState);

  return (
    // making it scrollable so if keyboard cuts into input, it can be scrolled up
    <>
      <AppActivityIndicator visible={loading} />
      <ScrollView>
        <Screen style={styles.container}>
          {/* <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        /> */}

          <AppForm
            initialValues={{
              minimum_spending: "0",
              expiry_date: "",
              amount_discount: "0",
              percentage_discount: "0",
              voucher_code: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <ListItemSeperator />
            {percent ? (
              <AppSquareFormField
                name='percentage_discount'
                maxLength={2}
                keyboardType='numeric'
                placeholderTitle='Percentage(%)'
                placeholder='Max. 99%'
              />
            ) : (
              <AppSquareFormField
                name='amount_discount'
                maxLength={5}
                keyboardType='number-pad'
                placeholderTitle='Amount($)'
                placeholder='Max. $10000'
              />
            )}
            <AppText
              style={{
                color: colors.muted,
                marginLeft: 10,
                marginTop: 10,
                fontSize: 15,
              }}
            >
              Vouchers end at midnight 00:00 of the expiry date
            </AppText>
            <AppExpiryPicker
              title='Expiration Date'
              name='expiry_date'
              loading={loading}
            />

            <ListItemSeperator />
            <AppSquareFormField
              name='minimum_spending'
              maxLength={5}
              keyboardType='numeric'
              placeholderTitle='Min Spend($)'
              placeholder='$0 for no minimum'
            />
            <AppSquareFormField
              name='voucher_code'
              maxLength={8}
              placeholderTitle='Voucher Code'
              placeholder='8 Characters'
            />
            <View
              style={{ flexDirection: "row-reverse", alignItems: "center" }}
            >
              <Switch onValueChange={toggleSwitch} value={percent} />
              <AppText style={{ color: colors.muted, fontSize: 15 }}>
                {percent ? "Percentage(%)" : "Amount($)"}
              </AppText>
            </View>
            <View
              style={{
                marginVertical: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Error_Message error={error} visible={error} />
              <SubmitButton title='Create Voucher' style={{ width: "50%" }} />
            </View>
          </AppForm>
        </Screen>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  discountContainer: {
    flexDirection: "row",
  },
  discountSymbol: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CreateMerchantVoucherScreen;
