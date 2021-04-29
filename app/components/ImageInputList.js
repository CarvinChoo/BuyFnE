import React, { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ImageInput from "./ImageInput";

function ImageInputList(
  { imageUris = [], onRemoveImage, onAddImage } //default empty array of images
) {
  // used to call a function on a Component///
  const scrollView = useRef(); // refernce to an instance of a component
  //////////////////////////////////////////

  return (
    //View is used to restrict ScrollView to only content within it
    // because View itself always shrinks to fit its contents
    <View>
      <ScrollView
        ref={scrollView} // to tell scrollView that this is the instance component we are referencing
        horizontal={true} // to scroll horizontally
        onContentSizeChange={() => scrollView.current.scrollToEnd()} //When component changes size, execute an event,
        //scrollToEnd() is a method found in ScrollView documentation
      >
        <View style={styles.container}>
          {/* split array into individual images, view is used to give each image right margin */}
          {imageUris.map((uri) => (
            <View key={uri} style={styles.image}>
              <ImageInput // each image is than inserted into an ImageInput to be displayed
                imageUri={uri}
                key={uri} // unique identifier
                onChangeImage={(null_sent_from_ImageInput) =>
                  onRemoveImage(uri)
                } // takes uri from current ImageInput component and request to remove it from parent
              />
            </View>
          ))}

          {/* Empty ImageInput waiting for image to be added */}
          <ImageInput
            onChangeImage={(uri) => onAddImage(uri)} // only adding action can happen for an empty image
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
  },
  image: {
    marginRight: 10,
  },
});

export default ImageInputList;
