import React, { useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import * as Yup from "yup";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
  AppFormImagePicker,
  Error_Message,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import colors from "../config/colors";
import AppTextInput2 from "../components/AppTextInput2";
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import filestorage from "../api/filestorage";
import * as firebase from "firebase";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import AppText from "../components/AppText";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validationSchema = Yup.object().shape(
  {
    title: Yup.string().required().min(1).label("Title"), //label is just to set the name for the field when displaying generic error message
    price: Yup.number().required().min(1).max(10000).label("Price"),
    quantity: Yup.number().required().min(1).max(10000).label("Quantity"),
    description: Yup.string().label("Description"),
    category: Yup.object().required().nullable().label("Category"),
    images: Yup.array().min(1, "Please select at least one image."), //.label("Images") causes message "Images field is required" which is not appropriate for the field
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

function ListingEditScreen() {
  // const [uploadVisible, setUploadVisible] = useState(false);
  // const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (uri, title, num) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = filestorage
      .ref()
      .child(currentUser.uid + "/listings/" + title + "/image" + num + ".jpeg");
    const snapshot = await ref.put(blob);
    // We're done with the blob, close and release it
    blob.close();
    return snapshot.ref.getDownloadURL();
  };

  const uploadListingImagesArray = (listing) => {
    const imageArray = listing.images;
    let i = 0;
    const promises = imageArray.map((image) => {
      i++;
      return uploadImage(image, listing.title, i);
    });
    return promises;
  };

  // Runs 1st to create all_listing collection
  const createListingCollection = (listing, resetForm) => {
    const discountedPrice =
      Math.round(
        (listing.price - (listing.price / 100) * listing.discount) * 100
      ) / 100;
    //Ready the all_listing collection for creation
    const ref = db.collection("all_listings").doc();
    // Query to check for existing similar titles by same seller
    db.collection("all_listings")
      .where("seller", "==", currentUser.uid)
      .where("title", "==", listing.title)
      .get()
      .then((query) => {
        if (query.empty) {
          // Uploads list of images and returns their promises
          const promises = uploadListingImagesArray(listing);

          // Make sure all promises in the array are resolved and have URL string in them
          Promise.all(promises).then((images) => {
            // Sets User's listings Collection
            const timeNow = firebase.firestore.Timestamp.now();
            ref
              .set({
                seller_logo: currentUser.store_logo,
                seller: currentUser.uid,
                store_name: currentUser.store_name,
                title: listing.title,
                price: Number(listing.price), // even though price is a number, but in a form, it is represented as a string
                discount: Number(listing.discount),
                quantity: Number(listing.quantity),
                description: listing.description,
                category: listing.category.value,
                images: images,
                createdAt: timeNow,
                listingId: ref.id,
                groupbuyId: null,
                salesTotal: 0,
                discount: Number(listing.discount),
                discountedPrice: discountedPrice,
                timelimitDays: Number(listing.days),
                timelimitHours: Number(listing.hours),
                timelimitMinutes: Number(listing.minutes),
                minimumOrderCount: Number(listing.minOrder),
                timeStart: null,
                timeEnd: null,
                currentOrderCount: 0,
                groupbuyStatus: "Inactive",
                groupbuyPayout: 0,
                groupbuyTotalPurchases: 0,
                shoppers: null,
                soldCount: 0,
                milestone1: false,
                milestone2: false,
                milestone3: false,
                milestone1_settings: null,
                milestone2_settings: null,
                milestone3_settings: null,
                buylimit: Number(listing.buylimit),
                listingStatus: "Active",
                reviews: 0,
                rating: 0,
              })
              .then(() => {
                setError(null);
                console.log("Listing Successfully Created.");
                resetForm(); // resets all fields in the form
                Alert.alert("Add Listing Success", "Listing Created!");
                setLoading(false);
              })
              .catch((error) => {
                console.log("createListingCollection error:", error.message);
                setError("Error communicating with database");
                setLoading(false);
              });
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
  const handleSubmit = (listing, { resetForm }) => {
    setLoading(true);
    createListingCollection(listing, resetForm);
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
              title: "",
              price: "", // even though price is a number, but in a form, it is represented as a string
              quantity: "",
              buylimit: "",
              description: "",
              category: null,
              images: [],
              discount: "",
              minOrder: "",
              minutes: "0",
              hours: "0",
              days: "0",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <AppFormImagePicker name='images' />
            <AppFormField name='title' maxLength={255} placeholder='Title' />
            <AppFormField
              name='price'
              maxLength={5}
              keyboardType='numeric'
              placeholder='Price'
              width={120}
              icon='currency-usd'
            />

            <AppFormField
              name='quantity'
              maxLength={5}
              keyboardType='number-pad'
              placeholder='Quantity'
              width={130}
              icon='truck-delivery'
            />
            <AppFormField
              name='buylimit'
              maxLength={5}
              keyboardType='number-pad'
              placeholder='Buy limit per user'
              width={210}
              icon='cart-plus'
            />
            <AppFormPicker
              name='category'
              items={categories}
              numOfColumns={3}
              PickerItemComponent={CategoryPickerItem}
              placeholder='Category'
              width='50%'
            />
            <AppFormField
              name='description'
              maxLength={600}
              multiline
              numberOfLines={3}
              placeholder='Description (Optional)'
            />
            <ListItemSeperator />
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
            <AppFormField
              name='discount'
              maxLength={2}
              keyboardType='numeric'
              placeholder='Group Buy Discount '
              width={230}
              icon='percent'
            />
            <AppFormField
              name='minOrder'
              keyboardType='numeric'
              placeholder='Minimum Members'
              width={250}
              icon='account-multiple-check'
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
            <AppFormField
              InputType={AppTextInput2}
              name='days'
              maxLength={2}
              keyboardType='number-pad'
              placeholder='Days'
              width={110}
              icon='timer-sand'
              trailingText='Days'
            />

            <AppFormField
              InputType={AppTextInput2}
              name='hours'
              maxLength={2}
              keyboardType='numeric'
              placeholder='Hours '
              width={120}
              icon='timer-sand'
              trailingText='Hours'
            />
            <AppFormField
              InputType={AppTextInput2}
              name='minutes'
              maxLength={2}
              keyboardType='numeric'
              placeholder='Minutes '
              width={130}
              icon='timer-sand'
              trailingText='Minutes'
            />
            <View style={{ marginVertical: 10 }}>
              <Error_Message error={error} visible={error} />
              <SubmitButton title='Post' />
            </View>
          </AppForm>
        </Screen>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, paddingBottom: 30 },
  discountContainer: {
    flexDirection: "row",
  },
  discountSymbol: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListingEditScreen;
