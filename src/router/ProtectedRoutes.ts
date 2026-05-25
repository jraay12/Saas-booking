import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    
  }, [token, navigate]);

  if (!token) return null;

  return children
}