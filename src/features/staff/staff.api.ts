import { api } from "../../lib/axios";

export const createStaff = async (data: any) => {
  const response = await api.post("/staff/", data);
  return response.data;
};

export const getStaffMembers = async () => {
  const response = await api.get("/membership/");
  return response.data.data;
};

export const deleteMembershipStaff = async (user_id: string) => {
  const response = await api.delete(`/membership/${user_id}`);

  return response.data.data;
};

export const getStaffById = async (id: string) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};
