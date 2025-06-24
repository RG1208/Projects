import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");

  // ✅ If token exists, allow access to child route
  return token ? <Outlet /> : <Navigate to="/login" />;
}
