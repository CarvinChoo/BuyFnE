import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../config/colors";
// import CompleteScreen from "../screens/CompleteScreen";
// import ToShipScreen from "../screens/ToShipScreen";
// import RefundScreen from "../screens/RefundScreen";
import routes from "./routes";
const Tab = createMaterialTopTabNavigator();

//tab properties(title,style properties)
function AdminVoucherNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.black,
        labelStyle: { fontSize: 15 },
        borderWidth: 5,
        style: { backgroundColor: colors.white },
      }}
    >
      <Tab.Screen
        name={routes.CATEGORIESVOUCHERS}
        component={ToShipScreen}
        options={{ tabBarLabel: "Categories Vouchers" }}
      />
      <Tab.Screen
        name={routes.STOREWIDEVOUCHERS}
        component={RefundScreen}
        options={{ tabBarLabel: "Storewide Vouchers" }}
      />
    </Tab.Navigator>
  );
}

export default AdminVoucherNavigator;
