import { Navigate, Outlet } from "react-router";
import { useAuth } from "../provider/AuthProvider";

export const PublicRoute = () => {
  const { user } = useAuth();

  const role = user?.memberships?.[0]?.role;

  if (role === "OWNER") {
    return <Navigate to="/admin/dashboard" />;
  }

  if (role === "STAFF") {
    return <Navigate to="/staff/dashboard" />;
  }

  if (user && !role) {
    return <Navigate to="/create/business" />;
  }

  return <Outlet />;
};
