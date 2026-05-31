import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  businessId?: string;
  role: string;
};

const token = localStorage.getItem("access_token");

let decoded: DecodedToken | null = null;

if (token) {
  try {
    decoded = jwtDecode<DecodedToken>(token);
    console.log(decoded);
  } catch (error) {
    console.error("Invalid token format", error);
  }
}

export const getBusinessId = () => {
  return decoded?.businessId ?? null;
};

export const getUserRole = () => {
  return decoded?.role ?? null;
};
