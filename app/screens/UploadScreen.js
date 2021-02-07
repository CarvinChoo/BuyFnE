import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";

import colors from "../config/colors";

function UploadScreen({ onDone, progress = 0, visible = false }) {
  return (
    //Modal is like a popup
    <Modal visible={visible}>
      <View style={styles.container}>
        {progress < 1 ? ( // if progress is 100%
          <Progress.Bar // renders progress bar
            progress={progress}
            color={colors.brightred}
            width={250}
          />
        ) : (
          // once done, renders done animation
          <LottieView
            autoPlay
            loop={false} //only play once
            onAnimationFinish={onDone} //raise an event to  tell Listing Edit Screen that the animation is done
            source={require("../assets/animations/done.json")}
            style={styles.animation}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  animation: { width: 200 }, // does not change Size
});

export default UploadScreen;
