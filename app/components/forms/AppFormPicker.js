import React from "react";
import { useFormikContext } from "formik";

import AppPicker from "../AppPicker";
import Error_Message from "./Error_Message";

function AppFormPicker({
  items,
  name,
  numOfColumns,
  placeholder,
  PickerItemComponent,
  width,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext(); //values is an array that contains name:item pairs within the form
  return (
    <>
      <AppPicker
        items={items}
        onSelectItem={(item) => setFieldValue(name, item)}
        placeholder={placeholder}
        selectedItem={values[name]} //returns an item based on the name
        width={width}
        PickerItemComponent={PickerItemComponent}
        numOfColumns={numOfColumns}
      />
      <Error_Message error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
