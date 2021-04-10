import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../config/colors";
import CompleteScreen from "../screens/CompleteScreen";
import ToShipScreen from "../screens/ToShipScreen";
import RefundScreen from "../screens/RefundScreen";

const Tab = createMaterialTopTabNavigator();

//tab properties(title,style properties)
function OrderHistoryNavigator() {
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
        name='Completed'
        component={CompleteScreen}
        options={{ tabBarLabel: "Completed" }}
      />
      <Tab.Screen
        name='ToShipScreen'
        component={ToShipScreen}
        options={{ tabBarLabel: "To Ship" }}
      />
      <Tab.Screen
        name='Refund'
        component={RefundScreen}
        options={{ tabBarLabel: "Refund" }}
      />
    </Tab.Navigator>
  );
}

export default OrderHistoryNavigator;
