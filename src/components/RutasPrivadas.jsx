
import React from "react";
import { Navigate} from "react-router-dom";
import { useAuth } from "./AuthContext";



export default function RutasPrivadas({ children, roles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Si tiene roles definidos, validar que el usuario pertenece
  if (roles && !roles.includes(user.rol)) {
    return <Navigate  to={user.rol === "admin" ? "/admin" : "/"} />;
  }

  return children;
}
