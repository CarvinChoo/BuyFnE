import React from "react";
import { useFormikContext } from "formik"; //used to import formik properties context from where AppFormField is used

import AppTextInput from "../AppTextInput";
import AppTextInput2 from "../AppTextInput2";
import Error_Message from "./Error_Message";

function AppFormField({
  name,
  width,
  InputType = AppTextInput,
  ...otherProps
}) {
  const {
    setFieldTouched,
    setFieldValue,
    values,
    errors,
    touched,
  } = useFormikContext();
  return (
    <>
      <InputType
        onBlur={() => setFieldTouched(name)} // when user leave the field, trigger an event
        onChangeText={(text) => setFieldValue(name, text)} // sets value withing Formik based on key(name) and value(text) imperatively (changes state within Formik)
        value={values[name]} //set values to zero when form resets
        width={width}
        {...otherProps}
      />
      <Error_Message
        error={errors[name]}
        visible={touched[name]} // only render message when field has been touched
      />
    </>
  );
}

export default AppFormField;
