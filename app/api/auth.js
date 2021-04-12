// Authentication API
import React, { useEffect, useRef, useState } from "react";
import app from "../auth/base.js";
import db from "../api/db";
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [initialLoading, setinitialLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(0);
  const [cart, setCart] = useState([]);
  const [productMounted, setProductMounted] = useState(false);
  const stillListening = useRef(false);
  useEffect(() => {
    console.log("Auth Mounted");
    var userListener;
    const subscriber = app.auth().onAuthStateChanged((user) => {
      console.log("running");
      if (user) {
        console.log("There is user");
        if (user.emailVerified == true) {
          console.log("user is verified");
          userListener = db
            .collection("users")
            .doc(user.uid)
            .onSnapshot(
              (user) => {
                stillListening.current = true;
                console.log("onSnapshot listener actively listening.");
                if (user.exists) {
                  const utype = user.data().type;
                  setUserType(utype);
                  setCurrentUser(user.data());
                } else {
                  stillListening.current = false;
                  setCurrentUser(null);
                  setUserType(0);
                }
                setinitialLoading(false);
              },
              (error) => {
                stillListening.current = false;
                console.log("Error in retreiving user: ", error.message);
                setUserType(0);
                setCurrentUser(null);
                setinitialLoading(false);
              }
            );
        } else {
          console.log("User not verified");
          // app.auth().signOut();
        }
      } else {
        if (stillListening.current) {
          console.log("onSnapshot listener stop listening 2.");
          userListener();
          stillListening.current = false;
        }
        console.log("There is no user. Set to Guest");
        setUserType(0);
        setCurrentUser(null);
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
        currentUser,
        isLoading,
        setIsLoading,
        userType,
        setUserType,
        cart,
        setCart,
        productMounted,
        setProductMounted,
        loggedIn,
        setLoggedIn,
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
