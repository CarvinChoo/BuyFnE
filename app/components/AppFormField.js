import React from "react";
import { useFormikContext } from "formik"; //used to import formik properties context from where AppFormField is used

import AppTextInput from "./AppTextInput";
import Error_Message from "./Error_Message";

function AppFormField({ name, ...otherProps }) {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
  return (
    <>
      <AppTextInput
        onBlur={() => setFieldTouched(name)} // when user leave the field, trigger an event
        onChangeText={handleChange(name)}
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
