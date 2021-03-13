// Authentication API
import React, { useEffect, useState } from "react";
import app from "../auth/base.js";
import AppLoading from "expo-app-loading";
import db from "../api/db";
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [pending, setPending] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("Guest");

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        const subscriber = db
          .collection("users")
          .doc(user.uid)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.exists) {
              setUserType(querySnapshot.data().type);
            }
          });
      } else {
        setUserType("Guest");
        console.log(userType);
      }
      setPending(false);
      return () => subscriber();
    });
  }, []);

  if (pending) {
    return <AppLoading />;
  }
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        setIsLoading,
        userType,
        setUserType,
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
