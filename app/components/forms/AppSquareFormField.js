import React from "react";
import { useFormikContext } from "formik"; //used to import formik properties context from where AppFormField is used

import SquareTextInput from "../SquareTextInput";
import Error_Message from "./Error_Message";
import ListItemSeperator from "../lists/ListItemSeperator";

function AppSquareFormField({ name, ...otherProps }) {
  const {
    setFieldTouched,
    setFieldValue,
    values,
    errors,
    touched,
  } = useFormikContext();
  return (
    <>
      <SquareTextInput
        onBlur={() => setFieldTouched(name)} // when user leave the field, trigger an event
        onChangeText={(text) => setFieldValue(name, text)} // sets value withing Formik based on key(name) and value(text) imperatively (changes state within Formik)
        value={values[name]} //set values to zero when form resets
        {...otherProps}
      />
      <ListItemSeperator />
      <Error_Message
        error={errors[name]}
        visible={touched[name]} // only render message when field has been touched
      />
    </>
  );
}

export default AppSquareFormField;
