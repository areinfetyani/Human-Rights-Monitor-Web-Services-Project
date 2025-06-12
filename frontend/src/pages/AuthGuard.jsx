// AuthGuard.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * AuthGuard Component
 * Protects routes by checking for a valid token in sessionStorage.
 * Optionally checks for specific user roles if allowedRoles is provided.
 *
 * @param {ReactNode} children - The component to render if authorized.
 * @param {Array<string>} allowedRoles - Optional list of roles allowed to access the route.
 */
const AuthGuard = ({ children, allowedRoles = [] }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  // Not logged in — redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role is not authorized — redirect to login
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // Access granted
  return children;
};

export default AuthGuard;