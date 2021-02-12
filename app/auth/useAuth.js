// Custom hook to store method to get user and setUser state Context from App.js
import { useContext } from "react";
import jwtDecode from "jwt-decode";

import AuthContext from "./context";
import authStorage from "./storage";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext); // retrieving the state and state function from App.js / parent component

  // Function to handle login process
  const logIn = (authToken) => {
    const user = jwtDecode(authToken);
    setUser(user); // setting user state in App.js

    // used to store authentication token in cache to prevent user from being logged out
    authStorage.storeToken(authToken);
  };

  //Function to handle logout process
  const logOut = () => {
    setUser(null); // removes user state from App.js
    authStorage.removeToken(); // remove user authToken from cache
  };

  return { user, logIn, logOut };
};
