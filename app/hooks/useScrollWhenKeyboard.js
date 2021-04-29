import { useEffect } from "react";
import { Keyboard } from "react-native";

///// Used to listen to Keyboard pop up, if shown, whole page scroll up/////
// Prevents Keyboard overlap with textinput
// passes
export default useScrollWhenKeyboard = (scrollView) => {
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
    };
  }, []);
  const _keyboardDidShow = () => {
    scrollView.current.scrollToEnd();
  };
};
////////////////////////////////////////////////////////////////////////////////
