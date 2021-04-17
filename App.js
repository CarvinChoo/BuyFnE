import React from "react";
import Route from "./app/route/Route";
import AuthApi from "./app/api/auth";
// import CheckoutScreen from "./app/screens/CheckoutScreen";
export default function App() {
  return (
    <AuthApi.AuthProvider>
      <Route />
    </AuthApi.AuthProvider>
    // <CheckoutScreen />
  );
}
