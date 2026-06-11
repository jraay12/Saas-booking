import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "./dashboard.api";
import { queryKeys } from "../../lib/queryKey";

export const useGetDashboard = () => {
  return useQuery({
    queryFn: getDashboard,
    queryKey: queryKeys.dashboard(),
    enabled: true
  });
};
