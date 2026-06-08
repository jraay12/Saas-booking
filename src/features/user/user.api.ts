import { api } from "../../lib/axios";
import type { UserProfile } from "../../types/types";

export const myProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/user/me");
  return response.data;
};
