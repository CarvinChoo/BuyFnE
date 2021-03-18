import React from "react";
import Route from "./app/route/Route";
import AuthApi from "./app/api/auth";
import ShoppingCartScreen from "./app/screens/ShoppingCartScreen";

export default function App() {
  return (
    <AuthApi.AuthProvider>
      <Route />
    </AuthApi.AuthProvider>
    // <ShoppingCartScreen />
  );
}
