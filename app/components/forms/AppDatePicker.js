import React from "react";
import { useState } from "react";
import { useFormikContext } from "formik"; //used to import formik properties context from where AppFormField is used
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppText from "../AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import Error_Message from "./Error_Message";

function AppDatePicker() {
  const {
    setFieldTouched,
    setFieldValue,
    values,
    errors,
    touched,
  } = useFormikContext();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(null);
  return (
    <>
      <TouchableWithoutFeedback onPress={() => setShow(true)}>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name='calendar-today'
            size={25}
            color={colors.muted}
            style={styles.icon}
          />

          {date == null ? (
            <AppText style={styles.dobText}>Date of Birth</AppText>
          ) : (
            <AppText>
              {date.getDate()} - {date.getMonth() + 1} - {date.getFullYear()}
            </AppText>
          )}
        </View>
      </TouchableWithoutFeedback>
      <Error_Message
        error={errors["dob"]}
        visible={touched["dob"]} // only render message when field has been touched
      />
      {show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={date == null ? new Date() : date}
          mode='date'
          display='spinner'
          onChange={(event, newdate) => {
            if (newdate) {
              setShow(false);
              setDate(newdate);
              setFieldValue("dob", JSON.stringify(newdate));
            }
            setShow(false);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    backgroundColor: colors.whitegrey,
    width: "50%",
  },
  icon: { marginRight: 10 },
  dobText: { color: colors.muted },
});

export default AppDatePicker;
