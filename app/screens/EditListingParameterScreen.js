import React, { useContext, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import * as Yup from "yup";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import {
  AppForm,
  AppSquareFormField,
  AppFormPicker,
  SubmitButton,
  Error_Message,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import colors from "../config/colors";
import AppTextInput2 from "../components/AppTextInput2";
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validationSchema = Yup.object().shape(
  {
    title: Yup.string().required().min(1).label("Title"), //label is just to set the name for the field when displaying generic error message
    price: Yup.number().required().min(1).max(10000).label("Price"),
    quantity: Yup.number().required().min(1).max(10000).label("Quantity"),
    description: Yup.string().label("Description"),
    category: Yup.object().required().nullable().label("Category"),
    discount: Yup.number()
      .required()
      .min(1, "Must be more 1% of the price.")
      .max(99, "Must be less 100% of the price.")
      .label("Discount (Percentage)"),
    minutes: Yup.number().integer().min(0).max(59).label("Minutes"),
    hours: Yup.number().when("days", {
      is: (days) => days <= 0,
      then: Yup.number().required().integer().min(1).max(23).label("Hours"),
      otherwise: Yup.number().integer().min(0).max(23).label("Hours"),
    }),
    days: Yup.number().when("hours", {
      is: 0,
      then: Yup.number()
        .required()
        .integer()
        .min(1, "Time limit must be at least 1 day if hours is not set")
        .max(60, "Maximum Group buy time limit is 60 days")
        .label("Days"),
      otherwise: Yup.number()
        .integer()
        .min(0)
        .max(60, "Maximum Group buy time limit is 60 days")
        .label("Days"), // maximum is around 2 months
    }),
    minOrder: Yup.number()
      .required()
      .integer()
      .min(1)
      .test({
        name: "max",
        exclusive: false,
        params: {},
        message: "${path} must be less than or equal to product quantity",
        test: function (value) {
          // You can access the price field with `this.parent`.
          return value <= this.parent.quantity;
        },
      })
      .label("Minimum order for Group Buy"),
    buylimit: Yup.number()
      .integer()
      .label("Buy limit per user")
      .min(1)
      .test({
        name: "max",
        exclusive: false,
        params: {},
        message: "${path} must be less than or equal to product quantity",
        test: function (value) {
          // You can access the price field with `this.parent`.
          return value <= this.parent.quantity;
        },
      }),
  },
  [["days", "hours"]]
);

const categories = [
  {
    label: "Furniture",
    value: 1,
    backgroundColor: "saddlebrown",
    icon: "table-furniture",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Clothing",
    value: 2,
    backgroundColor: "palevioletred",
    icon: "shoe-formal",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Food",
    value: 3,
    backgroundColor: "orange",
    icon: "food-fork-drink",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Games",
    value: 4,
    backgroundColor: "green",
    icon: "games",
    IconType: MaterialIcons,
  },
  {
    label: "Computer",
    value: 5,
    backgroundColor: colors.muted,
    icon: "computer",
    IconType: MaterialIcons,
  },
  {
    label: "Health",
    value: 6,
    backgroundColor: "red",
    icon: "heart-plus",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Books",
    value: 7,
    backgroundColor: "maroon",
    icon: "bookshelf",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Electronic",
    value: 8,
    backgroundColor: "skyblue",
    icon: "electrical-services",
    IconType: MaterialIcons,
  },
  {
    label: "Others",
    value: 9,
    backgroundColor: "blue",
    icon: "devices-other",
    IconType: MaterialIcons,
  },
];

function EditListingParameterScreen({ route }) {
  // const [uploadVisible, setUploadVisible] = useState(false);
  // const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthApi.AuthContext);
  var product = route.params;
  const [loading, setLoading] = useState(false);

  // Runs 1st to create all_listing collection
  const updateListingCollection = (listing, setFieldValue) => {
    const discountedPrice =
      Math.round(
        (listing.price - (listing.price / 100) * listing.discount) * 100
      ) / 100;
    // Query to check for existing similar titles by same seller
    db.collection("all_listings")
      .where("seller", "==", currentUser.uid)
      .where("title", "==", listing.title)
      .get()
      .then((query) => {
        var length = 0;
        query.forEach(() => {
          length = length + 1;
        });
        if (length <= 1) {
          db.collection("all_listings")
            .doc(product.listingId)
            .update({
              title: listing.title,
              price: Number(listing.price), // even though price is a number, but in a form, it is represented as a string
              discount: Number(listing.discount),
              quantity: Number(listing.quantity),
              description: listing.description,
              category: listing.category.value,
              discount: Number(listing.discount),
              discountedPrice: discountedPrice,
              timelimitDays: Number(listing.days),
              timelimitHours: Number(listing.hours),
              timelimitMinutes: Number(listing.minutes),
              minimumOrderCount: Number(listing.minOrder),
              buylimit: Number(listing.buylimit),
            })
            .then(() => {
              setFieldValue("title", listing.title);
              setFieldValue("price", listing.price);
              setFieldValue("discount", listing.discount);
              setFieldValue("quantity", listing.quantity);
              setFieldValue("description", listing.description);
              setFieldValue("category", listing.category);
              setFieldValue("discount", listing.discount);
              setFieldValue("days", listing.days);
              setFieldValue("hours", listing.hours);
              setFieldValue("minutes", listing.minutes);
              setFieldValue("minOrder", listing.minOrder);
              setFieldValue("buylimit", listing.buylimit);

              product.price = Number(listing.price); // even though price is a number, but in a form, it is represented as a string
              product.discount = Number(listing.discount);
              product.quantity = Number(listing.quantity);
              product.description = listing.description;
              product.category = listing.category.value;
              product.discount = Number(listing.discount);
              product.timelimitDays = Number(listing.days);
              product.timelimitHours = Number(listing.hours);
              product.timelimitMinutes = Number(listing.minutes);
              product.minimumOrderCount = Number(listing.minOrder);
              product.buylimit = Number(listing.buylimit);
              console.log("Listing Successfully Updated.");
              setError(null);
              Alert.alert("Update Listing Success", "Listing Updated!");
              setLoading(false);
            })
            .catch((error) => {
              console.log("updateListingCollection error:", error.message);
              setError("Error communicating with database");
              setLoading(false);
            });
        } else {
          console.log("Title already exist in your existing listings.");
          setError("Title already exist in your existing listings.");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setError("Error communicating with database");
        setLoading(false);
      });
  };

  //Function waits for input to POST new listing to server
  const handleSubmit = (listing, { setFieldValue }) => {
    setLoading(true);
    updateListingCollection(listing, setFieldValue);
  };

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
              title: product.title,
              price: product.price.toString(), // even though price is a number, but in a form, it is represented as a string
              quantity: product.quantity.toString(),
              buylimit: product.buylimit.toString(),
              description: product.description,
              category: categories[product.category - 1],
              discount: product.discount.toString(),
              minOrder: product.minimumOrderCount.toString(),
              minutes: product.timelimitMinutes.toString(),
              hours: product.timelimitHours.toString(),
              days: product.timelimitDays.toString(),
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <ListItemSeperator />
            <AppSquareFormField
              name='title'
              maxLength={200}
              placeholderTitle='Title'
              placeholder={product.title}
            />

            <AppSquareFormField
              name='price'
              maxLength={5}
              keyboardType='numeric'
              placeholderTitle='Price($)'
              placeholder={product.price.toString()}
            />

            <AppSquareFormField
              name='quantity'
              maxLength={5}
              keyboardType='number-pad'
              placeholderTitle='Quantity'
              placeholder='Quantity'
            />

            <AppSquareFormField
              name='buylimit'
              maxLength={5}
              keyboardType='number-pad'
              placeholderTitle='Buy limit'
              placeholder={product.buylimit.toString() + " per user"}
            />

            <AppFormPicker
              name='category'
              items={categories}
              numOfColumns={3}
              PickerItemComponent={CategoryPickerItem}
              placeholder={categories[product.category - 1].label}
            />
            <ListItemSeperator />
            <AppText
              style={{
                paddingVertical: 10,
                paddingLeft: 10,
                fontWeight: "bold",
              }}
            >
              Description
            </AppText>
            <ListItemSeperator />
            <AppSquareFormField
              containerStyle={{ borderWidth: 1, borderColor: colors.muted }}
              name='description'
              textAlign='left'
              maxLength={600}
              multiline
              numberOfLines={3}
              boxWidth={350}
              placeholder='Description (Optional)'
            />

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",

                paddingVertical: 5,
                backgroundColor: colors.darkslategrey,
                marginTop: 10,
              }}
            >
              <AppText style={{ fontWeight: "bold", color: colors.white }}>
                Group Buy settings
              </AppText>
            </View>
            <ListItemSeperator />
            <AppSquareFormField
              name='discount'
              maxLength={2}
              keyboardType='numeric'
              placeholderTitle='Discount(%)'
              placeholder={product.discount.toString() + "%"}
            />

            <AppSquareFormField
              name='minOrder'
              keyboardType='numeric'
              placeholderTitle='Min Order'
              placeholder={product.minimumOrderCount.toString()}
            />

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",

                  paddingVertical: 5,
                  backgroundColor: colors.darkslategrey,
                  marginVertical: 10,
                }}
              >
                <AppText
                  style={{
                    fontWeight: "bold",
                    color: colors.white,
                    marginHorizontal: 15,
                  }}
                >
                  Group Buy Time Limit
                </AppText>
              </View>
            </View>
            <ListItemSeperator />
            <AppSquareFormField
              InputType={AppTextInput2}
              name='days'
              maxLength={2}
              keyboardType='number-pad'
              placeholderTitle='Days'
              placeholder={product.timelimitDays.toString()}
            />

            <AppSquareFormField
              InputType={AppTextInput2}
              name='hours'
              maxLength={2}
              keyboardType='numeric'
              placeholderTitle='Hours'
              placeholder={product.timelimitHours.toString()}
            />

            <AppSquareFormField
              InputType={AppTextInput2}
              name='minutes'
              maxLength={2}
              keyboardType='numeric'
              placeholderTitle='Minutes'
              placeholder={product.timelimitMinutes.toString()}
            />

            <View
              style={{
                marginVertical: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Error_Message error={error} visible={error} />
              <SubmitButton title='Save Edit' style={{ width: "50%" }} />
            </View>
          </AppForm>

          <ListItemSeperator />
          <View style={{ marginVertical: 20 }}>
            <AppButton
              color='darkslateblue'
              title='Group Buy Milestone Settings'
            />
          </View>
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

export default EditListingParameterScreen;
