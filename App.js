import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";

///////////////////////Tab Navigator/////////////////////////////////////////////
// const Tab = createBottomTabNavigator();
// const TabNavigator = () => (
//   <Tab.Navigator
//     tabBarOptions={
//       {
//         // set style options for all tabs
//         // activeBackgroundColor: "tomato", // on tab bg color
//         // activeTintColor: "white", // on tab text color
//         // inactiveBackgroundColor: "#eee", //off tab bg color
//         // inactivateTintColor: "black", // off tab text color
//       }
//     }
//   >
//     <Tab.Screen
//       name='Feed'
//       component={StackNavigator} // Nest a Stack Navigator within a Tab Navigator component
//       options={
//         {
//           // tabBarIcon: (
//           //   { size, color } // size suggested by react native, color suggested by react native - based on TintColor
//           // ) => <MaterialCommunityIcons name='home' size={size} color={color} />,
//         }
//       }
//     />
//     <Tab.Screen
//       name='Account'
//       component={Account} // Account can have its own Stack Navigator that is different from Feed
//     />
//   </Tab.Navigator>
// );
//////////////////////////////////////////////////////////////////////////////////
export default function App() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <AuthNavigator />
    </NavigationContainer>
  );
}
