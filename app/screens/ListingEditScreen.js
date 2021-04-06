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
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import filestorage from "../api/filestorage";
import * as firebase from "firebase";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"), //label is just to set the name for the field when displaying generic error message
  price: Yup.number().required().min(1).max(10000).label("Price"),
  discount: Yup.number()
    .required()
    .min(1, "Must be more 1% of the price.")
    // .test({
    //   name: "max",
    //   exclusive: false,
    //   params: {},
    //   message: "${path} must be more than 10% of the price",
    //   test: function (value) {
    //     // You can access the price field with `this.parent`.
    //     return value <= parseFloat(this.parent.price * 0.1);
    //   },
    // })
    .max(99, "Must be less 100% of the price.")
    .label("Discount (Percentage)"),
  quantity: Yup.number().required().min(1).max(10000).label("Quantity"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."), //.label("Images") causes message "Images field is required" which is not appropriate for the field
});

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

  const addInAllListings = (listing, images, id, timeNow) => {
    const ref = db.collection("all_listings").doc();

    ref
      .set({
        seller: currentUser.uid,
        title: listing.title,
        price: Number(listing.price), // even though price is a number, but in a form, it is represented as a string
        discount: Number(listing.discount),
        quantity: Number(listing.quantity),
        description: listing.description,
        category: listing.category.value,
        images: images,
        createdAt: timeNow,
        listingID: id,
      })
      .then(() => {
        console.log("Listing Successfully Added to All Listings.");
        resetForm();
        Alert.alert("Add Listing Success", "Listing Created!");
      })
      .catch((error) => {
        console.log("addInAllListings error:", error.message);
      });
  };

  const createListingCollection = (listing, resetForm) => {
    const ref = db
      .collection("listings")
      .doc(currentUser.uid)
      .collection("my_listings")
      .doc();

    const query = db
      .collection("listings")
      .doc(currentUser.uid)
      .collection("my_listings")
      .where("title", "==", listing.title);

    query.get().then((query) => {
      if (query.empty) {
        // Uploads list of images and returns their promises
        const promises = uploadListingImagesArray(listing);

        // Make sure all promises in the array are resolved and have URL string in them
        Promise.all(promises).then((images) => {
          // Sets User's listings Collection
          const timeNow = firebase.firestore.Timestamp.now();
          ref
            .set({
              seller: currentUser.uid,
              title: listing.title,
              price: Number(listing.price), // even though price is a number, but in a form, it is represented as a string
              discount: Number(listing.discount),
              quantity: Number(listing.quantity),
              description: listing.description,
              category: listing.category.value,
              images: images,
              createdAt: timeNow,
              listingID: ref.id,
            })
            .then(() => {
              console.log("Listing Successfully Created.");
              addInAllListings(listing, images, ref.id, timeNow);
            })
            .catch((error) => {
              console.log("createListingCollection error:", error.message);
            });

          setError(null);
        });
      } else {
        setError("Title already exist in your existing listings.");
      }
    });
  };

  //Function waits for input to POST new listing to server
  const handleSubmit = async (listing, { resetForm }) => {
    createListingCollection(listing, resetForm);
  };

  return (
    // making it scrollable so if keyboard cuts into input, it can be scrolled up
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
            discount: "",
            quantity: "",
            description: "",
            category: null,
            images: [],
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
            name='discount'
            maxLength={2}
            keyboardType='numeric'
            placeholder='Group Buy Discount '
            width={230}
            icon='percent'
          />
          <AppFormField
            name='quantity'
            maxLength={5}
            keyboardType='numeric'
            placeholder='Quantity'
            width={130}
            icon='truck-delivery'
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
            placeholder='Description'
          />
          <Error_Message error={error} visible={error} />
          <SubmitButton title='Post' />
        </AppForm>
      </Screen>
    </ScrollView>
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

export default ListingEditScreen;
