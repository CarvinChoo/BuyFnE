import React from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
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

function ListingEditScreen(props) {
  return (
    // making it scrollable so if keyboard cuts into input, it can be scrolled up
    <ScrollView>
      <Screen style={styles.container}>
        <AppForm
          initialValues={{
            title: "",
            price: "", // even though price is a number, but in a form, it is represented as a string
            description: "",
            categories: null,
          }}
          onSubmit={(values) => console.log(values)}
          validationSchema={validationSchema}
        >
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
