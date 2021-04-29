import React, { useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import * as ImagePicker from "expo-image-picker";

function ImageInput({ imageUri, onChangeImage }) {
  // ensures premission is asked and will only ask once due to empty []
  useEffect(() => {
    requestPremission();
  }, []);

  //Request Premission to access Media Library///////////////////////////////////
  const requestPremission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable premission to access the library.");
  };

  //on press function
  const handlePress = () => {
    //if no image open up photo library
    if (!imageUri) selectImage();
    else
      Alert.alert(
        "Delete",
        "Are you sure you want to delete this image?", //if image is already there, alert pop up to ask if they want to delete
        [
          // Buttons array to show when alert is active
          { text: " yes", onPress: () => onChangeImage(null) }, //user says yes to delete, and image changed to null
          { text: "no" }, // user says no so action cancelled
        ]
      );
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Select type of media to allow to be uploaded,  "ImagePicker.MediaTypeOptions.Images" only allows images
        quality: 0.5, // determines quality of image : "1" highest - "0" lowest quality
      });

      //if user didnt cancel
      if (!result.cancelled) onChangeImage(result.uri); //onChangeImage sends back the new state to parent component so their imageUri state can be changed
    } catch (error) {
      console.log("Error reading an image!");
    }
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.container}>
          {!imageUri && (
            <MaterialCommunityIcons
              name='camera'
              size={40}
              color={colors.muted}
            />
          )}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whitegrey,
    borderRadius: 15,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageInput;
