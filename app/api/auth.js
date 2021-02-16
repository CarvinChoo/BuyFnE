// Authentication API
import React, { useEffect, useState } from "react";
import app from "../auth/base.js";
import AppLoading from "expo-app-loading";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
      console.log("Current User:", user);
    });
  }, []);

  if (pending) {
    return <AppLoading />;
  }
  return (
    <AuthContext.Provider
      value={{
        currentUser,
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
