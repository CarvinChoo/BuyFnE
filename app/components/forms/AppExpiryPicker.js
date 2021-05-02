import React, { useEffect } from "react";
import { useState } from "react";
import { useFormikContext } from "formik"; //used to import formik properties context from where AppFormField is used
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppText from "../AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import Error_Message from "./Error_Message";

function AppExpiryPicker({ name, title }) {
  const { setFieldValue, values, errors, touched } = useFormikContext();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(null);
  var currdate = new Date();

  // add a day
  currdate.setDate(currdate.getDate() + 1);

  useEffect(() => {
    if (values[name] == "") {
      setDate(null);
    }
  }, [values[name]]);
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
            <AppText style={styles.dobText}>{title}</AppText>
          ) : (
            <AppText>
              {date.getDate()} - {date.getMonth() + 1} - {date.getFullYear()}
            </AppText>
          )}
        </View>
      </TouchableWithoutFeedback>
      <Error_Message
        error={errors[name]}
        visible={touched[name]} // only render message when field has been touched
      />

      {show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={date == null ? new Date() : date}
          minimumDate={currdate}
          mode='date'
          display='spinner'
          onChange={(event, newdate) => {
            if (newdate) {
              newdate.setHours(0, 0, 0, 0);
              setShow(false);
              setDate(newdate);
              setFieldValue(name, JSON.stringify(newdate));
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
    width: "60%",
  },
  icon: { marginRight: 10 },
  dobText: { color: colors.muted },
});

export default AppExpiryPicker;
