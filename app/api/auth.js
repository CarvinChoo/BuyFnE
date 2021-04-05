// Authentication API
import React, { useEffect, useState } from "react";
import app from "../auth/base.js";
import db from "../api/db";
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [initialLoading, setinitialLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(0);
  const [guestMode, setGuestMode] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const subscriber = app.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified == true) {
          db.collection("users")
            .doc(user.uid)
            .get()
            .then((querySnapshot) => {
              if (querySnapshot.exists) {
                const utype = querySnapshot.data().type;
                setUserType(utype);
              }
              setCurrentUser(user);
              setLoginLoading(false);
              setinitialLoading(false);
            })
            .catch((error) => {
              console.log(error);
              console.log("Error in retrieval of user type");
              setCurrentUser(null);
              setLoginLoading(false);
              setinitialLoading(false);
            });
        }
      } else {
        setUserType(0);
        setCurrentUser(null);
        setLoginLoading(false);
        setinitialLoading(false);
      }
    });
    return () => subscriber();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        initialLoading,
        loginLoading,
        setLoginLoading,
        currentUser,
        isLoading,
        setIsLoading,
        userType,
        setUserType,
        guestMode,
        setGuestMode,
        cart,
        setCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default {
  AuthContext,
  AuthProvider,
};
