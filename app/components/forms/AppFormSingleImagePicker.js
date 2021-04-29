import { useFormikContext } from "formik";
import React from "react";
import ImageInput from "../ImageInput";
import Error_Message from "./Error_Message";
// For Single Image Form Inputs
function AppFormSingleImagePicker({ name }) {
  // {name} is the name of the form component label

  const { errors, setFieldValue, touched, values } = useFormikContext(); // uses Formik to handle state changes

  // Variable storing image Array
  const imageUri = values[name]; // the element returned by values[name] is an image array

  return (
    <>
      <ImageInput // each image is than inserted into an ImageInput to be displayed
        imageUri={imageUri}
        key={imageUri} // unique identifier
        onChangeImage={(uri) =>
          setFieldValue(
            name, // form component label
            uri
          )
        } // takes uri from current ImageInput component and request to remove it from parent
      />
      <Error_Message error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormSingleImagePicker;
