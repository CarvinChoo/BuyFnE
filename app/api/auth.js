// Authentication API
import React, { useEffect, useRef, useState } from "react";
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
  const [productMounted, setProductMounted] = useState(false);
  const stillListening = useRef(false);
  useEffect(() => {
    console.log("Auth Mounted");
    var userListener;
    const subscriber = app.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified == true) {
          userListener = db
            .collection("users")
            .doc(user.uid)
            .onSnapshot(
              (querySnapshot) => {
                stillListening.current = true;
                console.log("onSnapshot listener actively listening.");
                if (querySnapshot.exists) {
                  const utype = querySnapshot.data().type;
                  setUserType(utype);
                  setCurrentUser(querySnapshot.data());
                } else {
                  stillListening.current = false;
                  setCurrentUser(null);
                }
                setLoginLoading(false);
                setinitialLoading(false);
              },
              (error) => {
                stillListening.current = false;
                console.log("Error in retreiving user: ", error.message);
                setCurrentUser(null);
                setLoginLoading(false);
                setinitialLoading(false);
              }
            );
        }
      } else {
        if (stillListening.current) {
          console.log("onSnapshot listener stop listening 2.");
          userListener();
          stillListening.current = false;
        }
        setUserType(0);
        setCurrentUser(null);
        setLoginLoading(false);
        setinitialLoading(false);
      }
    });

    return () => {
      if (stillListening.current) {
        userListener();
        stillListening.current = false;
        console.log("onSnapshot listener stop listening.");
      }
      subscriber();
      console.log("Auth UnMounted");
    };
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
        productMounted,
        setProductMounted,
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
