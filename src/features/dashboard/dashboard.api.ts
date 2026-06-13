import { api } from "../../lib/axios";

export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};


export const getStaffDashboard = async () => {
  const response = await api.get("/dashboard/staff");
  return response.data;
};
