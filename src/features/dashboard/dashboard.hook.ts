import { useQuery } from "@tanstack/react-query";
import { getDashboard, getStaffDashboard } from "./dashboard.api";
import { queryKeys } from "../../lib/queryKey";
import { getUserId } from "../../lib/decoder";

export const useGetDashboard = () => {
  return useQuery({
    queryFn: getDashboard,
    queryKey: queryKeys.dashboard(),
    enabled: true
  });
};



export const useGetStaffDashboard = () => {
  const userId = getUserId()
  return useQuery({
    queryFn: getStaffDashboard,
    queryKey: queryKeys.staff_dashboard(userId!),
    enabled: !!userId
  });
};
