import React from "react";
import Route from "./app/route/Route";
import AuthApi from "./app/api/auth";
import PaymentScreen from "./app/screens/PaymentScreen";
export default function App() {
  return (
    <AuthApi.AuthProvider>
      <Route />
    </AuthApi.AuthProvider>
    // <PaymentScreen />
  );
}
