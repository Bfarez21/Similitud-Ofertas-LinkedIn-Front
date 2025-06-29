// components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, reverse = false }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si es una ruta pública y no hay token, permite el acceso
    if (reverse) return children;
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      if (reverse) return children;
      return <Navigate to="/login" replace />;
    }

    // Si es una ruta pública (reverse=true) y ya está logueado, redirige a /home
    if (reverse) return <Navigate to="/home" replace />;

    // Si todo está bien y es ruta protegida, permite el acceso
    return children;

  } catch {
    if (reverse) return children;
    return <Navigate to="/login" replace />;
  }
}
