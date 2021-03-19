import React from "react";
import Route from "./app/route/Route";
import AuthApi from "./app/api/auth";
import ListingsHistoryScreen from "./app/screens/ListingsHistoryScreen";

export default function App() {
  return (
    <AuthApi.AuthProvider>
      <Route />
    </AuthApi.AuthProvider>
    // <ListingsHistoryScreen />
  );
}
