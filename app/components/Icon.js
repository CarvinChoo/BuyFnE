import React from "react";
import { View } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
function Icon({
  // a reusable icon component that can dynamically change icon, size, background color and icon color
  name,
  size = 40,
  backgroundColor = colors.black,
  iconColor = colors.white,
  IconType = MaterialCommunityIcons,
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor, // if key and value are the same, you can just use the key name without specifying the value name again
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconType name={name} color={iconColor} size={size * 0.5} />
    </View>
  );
}

export default Icon;
