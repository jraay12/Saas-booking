import { api } from "../../lib/axios";

export const createBusinessHours = async (data: any) => {
  const response = await api.post("/business-hours/", data);
  return response.data;
};

export const getBusinessHours = async () => {
  const response = await api.get("/business-hours");
  return response.data.data;
};

export const getBusinessHoursPublic = async (business_id: string) => {
  const response = await api.get(`/business-hours/${business_id}/public`);
  return response.data.data;
};


export const getBusinessDetailsBySlug = async (slug: string) => {
  const response = await api.get(`/business/${slug}`);
  return response.data.data;
};
