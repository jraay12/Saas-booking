import { api } from "../../lib/axios";
import type { StaffMember } from "../../types/types";

export const createService = async (data: any) => {
  const response = await api.post("/service", data);
  return response.data;
};

export const getAllService = async () => {
  const response = await api.get("/service");
  return response.data;
};

export const toggleStatus = async (id: string) => {
  const response = await api.post(`/service/${id}/toggle-status`);
  return response.data;
};

export const updateService = async (data: any, id: string) => {
  const response = await api.patch(`/service/${id}`, data);
  return response.data;
};

export const getAssignedStaffInService = async (id: string) => {
  const response = await api.get(`/service/${id}/assigned`);
  return response.data;
};

export const getUnassignedStaffInService = async (id: string): Promise<StaffMember[]> => {
  const response = await api.get(`/service/${id}/unassigned`);
  return response.data;
};

export const assignStaff = async (data: {service_id: string, staff_ids: string[]}) => {
  const response = await api.post(`/service/assign`, data);
  return response.data;
};