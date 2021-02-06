import { DefaultTheme } from "@react-navigation/native";
import colors from "../config/colors";

export default {
  ...DefaultTheme, // copy DefaultTheme properties
  colors: {
    //copy and overwrite DefaultTheme.colors
    ...DefaultTheme.colors,
    primary: colors.brightred, //overwrite DefaultTheme.colors.primary * deosnt work currently, suppose to change tintColor
    background: colors.white, //overwrite DefaultTheme.colors.background, change background color of all screens in NavigationContainer
  },
};
