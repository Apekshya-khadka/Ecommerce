import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role doesn’t match requiredRole → show access denied
  if (requiredRole && role !== requiredRole) {
    return <div className="alert alert-danger m-3">Access denied: {requiredRole}s only</div>;
  }

  // Otherwise → allow access
  return children;
}

export default ProtectedRoute;
