import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import defaultStyles from "../config/styles";

function MessageTextInput({
  icon,
  width = "100%",
  color,
  containerStyle,
  onSubmit,
  newMessage = "",
  ...otherProps
}) {
  const [value, setValue] = useState(newMessage);
  const [refresh, setRefresh] = useState(0);
  //"...otherProps" copies all other properties given in the argument that isn't specified before
  // Text box Bar with conditional icon and dynamic text rendering
  useEffect(() => {
    setValue("");
  }, [refresh]);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
      }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: color ? color : colors.whitegrey },
          containerStyle,
        ]}
      >
        <TextInput
          placeholderTextColor={colors.muted}
          style={{ color: colors.black, width: "85%" }}
          value={value}
          onChangeText={(newvalue) => {
            setValue(newvalue);
          }}
          {...otherProps} // spread all other properties given in argument into this component
        />
        <TouchableOpacity
          onPress={() => {
            setValue("");
          }}
        >
          <MaterialCommunityIcons
            color={colors.gray}
            size={20}
            name='close-circle'
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          setRefresh((refresh) => refresh + 1);
          Keyboard.dismiss();
          onSubmit(value);
        }}
      >
        <MaterialCommunityIcons
          style={{ marginLeft: 5 }}
          color={colors.teal}
          size={30}
          name='message-arrow-right'
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 10,
  },
});

export default MessageTextInput;
