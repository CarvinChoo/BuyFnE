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
  // useEffect(() => {
  //   console.log("Auth Mounted");
  //   var userListener;
  //   const subscriber = app.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       if (user.emailVerified == true) {
  //         userListener = db
  //           .collection("users")
  //           .doc(user.uid)
  //           .onSnapshot(
  //             (querySnapshot) => {
  //               stillListening.current = true;
  //               console.log("onSnapshot listener actively listening.");
  //               if (querySnapshot.exists) {
  //                 const utype = querySnapshot.data().type;
  //                 setUserType(utype);
  //                 setCurrentUser(querySnapshot.data());
  //               } else {
  //                 stillListening.current = false;
  //                 setCurrentUser(null);
  //               }
  //               setLoginLoading(false);
  //               setinitialLoading(false);
  //             },
  //             (error) => {
  //               stillListening.current = false;
  //               console.log("Error in retreiving user: ", error.message);
  //               setCurrentUser(null);
  //               setLoginLoading(false);
  //               setinitialLoading(false);
  //             }
  //           );
  //       }
  //     } else {
  //       if (stillListening.current) {
  //         console.log("onSnapshot listener stop listening 2.");
  //         userListener();
  //         stillListening.current = false;
  //       }
  //       setUserType(0);
  //       setCurrentUser(null);
  //       setLoginLoading(false);
  //       setinitialLoading(false);
  //     }
  //   });

  //   return () => {
  //     if (stillListening.current) {
  //       userListener();
  //       stillListening.current = false;
  //       console.log("onSnapshot listener stop listening.");
  //     }
  //     subscriber();
  //     console.log("Auth UnMounted");
  //   };
  // }, []);

  useEffect(() => {
    console.log("Running Authenticator");
    var userListener;
    if (app.auth().currentUser) {
      if (app.auth().currentUser.emailVerified == true) {
        userListener = db
          .collection("users")
          .doc(app.auth().currentUser.uid)
          .onSnapshot(
            (user) => {
              stillListening.current = true;
              console.log("onSnapshot listener actively listening.");
              if (user.exists) {
                var utype = user.data().type;
                setUserType(utype);
                setCurrentUser(user.data());
              } else {
                stillListening.current = false;
                setCurrentUser(null);
              }
              setinitialLoading(false);
            },
            (error) => {
              stillListening.current = false;
              console.log("Error in retreiving user: ", error.message);
              setCurrentUser(null);
              setUserType(0);
              setinitialLoading(false);
            }
          );
      } else {
        console.log("User is not verified");
        setCurrentUser(null);
        setUserType(0);
        setinitialLoading(false);
      }
    } else {
      console.log("There is no user. Set to Guest");
      setCurrentUser(null);
      setUserType(0);
      setinitialLoading(false);
    }
  }, [loggedIn]);

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
