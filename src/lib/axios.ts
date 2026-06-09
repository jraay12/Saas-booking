import axios from "axios";
import type { UserProfile } from "../types/types";
import { queryKeys } from "./queryKey";
import { queryClient } from "../provider/QueryProvider";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const user = queryClient.getQueryData<UserProfile>(queryKeys.profile());
  console.log(user)
  const businessId = user?.memberships?.[0]?.business_id;
  if (businessId) {
    config.headers["x-business-id"] = businessId;
  }

  return config;
});