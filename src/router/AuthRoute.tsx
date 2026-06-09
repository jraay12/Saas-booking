import { Navigate, Outlet } from "react-router";
import { useAuth } from "../provider/AuthProvider";

export const AuthRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const role = user.memberships?.[0]?.role;
  if (role === "OWNER") return <Navigate to="/admin/dashboard" replace />;
  if (role === "STAFF") return <Navigate to="/staff/dashboard" replace />;

  return <Outlet />;
};
