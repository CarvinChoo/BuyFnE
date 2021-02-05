import React from "react";
import { StyleSheet, View } from "react-native";
import ImageInput from "./ImageInput";

function ImageInputList(
  { imageUris = [], onRemoveImage, onAddImage } //default empty array of images
) {
  return (
    <View style={styles.container}>
      {/* split array into individual images */}
      {imageUris.map((uri) => (
        <View key={uri} style={styles.image}>
          <ImageInput // each image is than inserted into an ImageInput to be displayed
            imageUri={uri}
            key={uri} // unique identifier
            onChangeImage={() => onRemoveImage(uri)} // only remove action can happen for an exiting image
          />
        </View>
      ))}

      {/* Empty ImageInput waiting for image to be added */}
      <ImageInput
        onChangeImage={(uri) => onAddImage(uri)} // only adding action can happen for an empty image
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    marginRight: 10,
  },
});

export default ImageInputList;
