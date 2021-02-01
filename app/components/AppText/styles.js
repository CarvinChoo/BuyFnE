import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    ...Platform.select({
      // "..." spreads the properties of the object returned by Platform.select into the "text" object
      // returns on of the objects inside it e.g. ios or android, depending on the platform
      ios: {
        fontSize: 20,
        fontFamily: "Avenir",
        color: "green",
      },
      android: {
        fontSize: 18,
        color: "blue",
        fontStyle: "italic",
      },
    }),
  },
});

export default styles;
