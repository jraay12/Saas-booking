import { api } from "../../lib/axios";

export const createBusinessHours = async (data: any) => {
  const response = await api.post("/business-hours/", data);
  return response.data;
};

export const getBusinessHours = async () => {
  const response = await api.get("/business-hours");
  return response.data.data;
};
