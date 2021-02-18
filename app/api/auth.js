// Authentication API
import React, { useEffect, useState } from "react";
import app from "../auth/base.js";
import AppLoading from "expo-app-loading";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [pending, setPending] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
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
