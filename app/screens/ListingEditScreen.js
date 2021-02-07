import React, { useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
  AppFormImagePicker,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import useLocation from "../hooks/useLocation";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"), //label is just to set the name for the field when displaying generic error message
  price: Yup.number().required().min(1).max(10000).label("Price"),
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
  // call for custom location hook to ask for permission and retrieve location of user
  const location = useLocation();

  //Function to POST new listing to server
  const handleSubmit = async (listing) => {
    //Alternative
    // listing.location = location
    // const result = await listingsApi.addListing({listing});

    // Await for listing to be added and sends it to API to POST to server
    const result = await listingsApi.addListing({ ...listing, location }); // spreads "listing" properties and include location as a property
    if (!result.ok) {
      // when POST request met with an error
      alert("Failed to save the listing.");
      return;
    }
    alert("Success! Listing Added.");
  };
  return (
    // making it scrollable so if keyboard cuts into input, it can be scrolled up
    <ScrollView>
      <Screen style={styles.container}>
        <AppForm
          initialValues={{
            title: "",
            price: "", // even though price is a number, but in a form, it is represented as a string
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
            maxLength={255}
            multiline
            numberOfLines={3}
            placeholder='Description'
          />
          <SubmitButton title='Post' />
        </AppForm>
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
});

export default ListingEditScreen;
