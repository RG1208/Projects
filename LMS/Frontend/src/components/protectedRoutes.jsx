import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token)
    return <Navigate to="/login" replace state={{ from: location }} />;

  // Decode JWT (if needed) to get the role
  const payload = JSON.parse(atob(token.split(".")[1])); // not secure for production
  const userRole = payload?.role;

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}
