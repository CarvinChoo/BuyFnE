import React from "react";

import AppPickerCat from "./AppPickerCat";
import Error_Message from "./forms/Error_Message";
import routes from "../navigation/routes";

function AppFormPickerCat({ items, numOfColumns, navigation }) {
  return (
    <>
      <AppPickerCat
        items={items}
        onSelectItem={(item) =>
          navigation.navigate(routes.CATEGORY, {
            value: item.value,
            title: item.label,
          })
        }
        numOfColumns={numOfColumns}
      />
    </>
  );
}

export default AppFormPickerCat;
