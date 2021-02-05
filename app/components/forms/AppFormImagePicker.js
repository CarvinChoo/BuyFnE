import { useFormikContext } from "formik";
import React from "react";

import ImageInputList from "../ImageInputList";
import Error_Message from "./Error_Message";

function AppFormImagePicker({ name }) {
  // {name} is the name of the form component label

  const { errors, setFieldValue, touched, values } = useFormikContext(); // uses Formik to handle state changes

  // Variable storing image Array
  const imageUris = values[name]; // the element returned by values[name] is an image array

  // function that handles adding new uri into array and setting the state
  const handleAdd = (uri) => {
    setFieldValue(name, [...imageUris, uri]);
  }; //setFieldValue matches {name} with new state to be set in parent component

  // function that handles filtering uri from array and setting the state
  const handleRemove = (uri) => {
    setFieldValue(
      name, // form component label
      imageUris.filter((imageUri) => imageUri !== uri) // filter and keep only non-matching
    );
  };

  return (
    <>
      <ImageInputList
        imageUris={imageUris}
        onAddImage={(uri) => handleAdd(uri)} // passes what "uri" was sent back from ImageInput into this function
        onRemoveImage={(uri) => handleRemove(uri)}
      />
      <Error_Message error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormImagePicker;
