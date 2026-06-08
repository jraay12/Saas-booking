import { Navigate, Outlet } from "react-router";
import { useAuth } from "../provider/AuthProvider";

export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles?: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.memberships?.[0]?.role;

  if (!role) {
    return <Navigate to="/create/business" replace />;
  }

  if (!allowedRoles?.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
