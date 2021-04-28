import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../config/colors";
// import ToShipScreen from "../screens/ToShipScreen";
// import RefundScreen from "../screens/RefundScreen";
import MerchantToShipScreen from "../screens/MerchantToShipScreen";
import MerchantShippedScreen from "../screens/MerchantShippedScreen";
import MerchantCompleteScreen from "../screens/MerchantCompleteScreen";
import routes from "./routes";
const Tab = createMaterialTopTabNavigator();
//tab properties(title,style properties)
function MerchantOrdersNavigator() {
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
        name={routes.MERCHANTTOSHIP}
        component={MerchantToShipScreen}
        options={{ tabBarLabel: "To Ship" }}
      />
      <Tab.Screen
        name={routes.MERCHANTSHIPPED}
        component={MerchantShippedScreen}
        options={{ tabBarLabel: "Shipped" }}
      />
      <Tab.Screen
        name={routes.MERCHANTCOMPLETE}
        component={MerchantCompleteScreen}
        options={{ tabBarLabel: "Complete" }}
      />
    </Tab.Navigator>
  );
}

export default MerchantOrdersNavigator;
