import { api } from "../../lib/axios";

export const register = async (data: any) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};