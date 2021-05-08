import React from "react";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";

function SubmitButton({ title, style, color }) {
  const { handleSubmit } = useFormikContext();
  return (
    <AppButton
      style={style}
      title={title}
      onPress={handleSubmit}
      color={color}
    />
  );
}

export default SubmitButton;
