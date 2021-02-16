import React from "react";
import AuthApi from "./app/api/auth";
import Route from "./app/route/Route";

export default function App() {
  return (
    <AuthApi.AuthProvider>
      <Route />
    </AuthApi.AuthProvider>
  );
}
