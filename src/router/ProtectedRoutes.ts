import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router";
type DecodedToken = {
  role: string;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const location = useLocation();
  const lastSegment = location.pathname.split("/").filter(Boolean).pop();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (!allowedRoles.includes(decoded.role)) {
        if (decoded.role === "STAFF") {
          navigate(`/staff/${lastSegment}`, { replace: true });
        } else if (decoded.role === "OWNER") {
          navigate(`/admin/${lastSegment}`, { replace: true });
        } else {
          navigate("/login", { replace: true });
        }

        return;
      }
    } catch {
      navigate("/login", { replace: true });
      return;
    }

    setChecked(true);
  }, [navigate, allowedRoles]);

  if (!checked) return null;

  return children;
}
