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
  const [userType, setUserType] = useState(0);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.exists) {
              const utype = querySnapshot.data().type;
              setUserType(utype);
            }
          })
          .catch((error) => {
            console.log(error);
            console.log("Error in retrieval of user type");
          });
      } else {
        setUserType(0);
      }
      setPending(false);
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
