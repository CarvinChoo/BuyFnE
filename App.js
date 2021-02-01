import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  Image,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

export default function App() {
  //console.log("App Executed"); //Debug for execution
  return (
    <SafeAreaView style={styles.container}>
      <Button
        // color='orange'
        title='Click Me'
        // onPress={() => console.log("Button Tapped")
        // onPress={() => alert("Button Tapped")
        // onPress={() =>
        //   Alert.alert("my title", "My message", [
        //     { text: "Yes", onPress: () => console.log("Yes") },
        //     { text: "No", onPress: () => console.log("No") },
        //   ])
        // }
        onPress={() =>
          Alert.prompt("My title", "My message", (text) => console.log(text))
        } // only works for iOS, not android
      />
      <StatusBar style='auto' />
      {/* makes status bar transparent */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //it means this is flexiable and will grow vertically or horizontally to fill the free space
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
