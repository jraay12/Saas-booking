import { Navigate, Outlet } from "react-router";
import { useAuth } from "../provider/AuthProvider";

export const PublicRoute = () => {
  const { user } = useAuth();

  if (user && user.memberships[0].role === "OWNER") {
    return <Navigate to={"/admin/dashboard"} />;
  }

  if (user && user.memberships[0].role === "STAFF") {
    return <Navigate to={"/staff/dashboard"} />;
  }

  return <Outlet />;
};
