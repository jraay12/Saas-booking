import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../provider/AuthProvider";

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { refetch } = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("access_token", token);

    refetch().then((result) => {
      const role = result.data?.memberships?.[0]?.role;
      if (role === "OWNER") return navigate("/admin/dashboard");
      if (role === "STAFF") return navigate("/staff/dashboard");
      navigate("/create/business");
    });
  }, []);

  return <div>Signing you in...</div>;
};

export default OAuthCallbackPage;