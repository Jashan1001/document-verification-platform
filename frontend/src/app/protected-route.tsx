import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction check
  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}