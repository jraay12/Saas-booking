import { api } from "../../lib/axios";

export const createStaff = async (data: any) => {
  const response = await api.post("/staff/", data);
  return response.data;
};

export const getStaffMembers = async () => {
  const response = await api.get("/membership/");
  return response.data.data;
};