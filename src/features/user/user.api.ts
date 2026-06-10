import { api } from "../../lib/axios";
import type { UpdateUserDTO } from "../../schema/user";
import type { UserProfile } from "../../types/types";

export const myProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/user/me");
  return response.data;
};


export const updateUser = async (id: string, data: FormData) => {
  const response = await api.patch(`/user/${id}`, data)
  return response.data
}