import { api } from "../../lib/axios";

export const createService = async (data: any) => {
  const response = await api.post("/service", data);
  return response.data;
};
