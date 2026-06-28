import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  // Not logged in at all
  if (!username || !role) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role for this route (case-insensitive check)
  if (allowedRoles && !allowedRoles.some((r) => r.toUpperCase() === role.toUpperCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
}
