import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("access_token");

let decoded: any;
try {
  decoded = jwtDecode(token!);
  console.log(decoded);
} catch (error) {
  console.error("Invalid token format", error);
}

export const getBusinessId = () => {
  return decoded.businessId;
};
