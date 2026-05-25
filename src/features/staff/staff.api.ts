import { api } from "../../lib/axios";

export const createStaff = async (data: any) => {
  const response = await api.post("/staff/", data);
  return response.data;
};