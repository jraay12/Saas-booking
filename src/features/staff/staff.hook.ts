import { queryKeys } from "../../lib/queryKey";
import { createStaff, getStaffMembers } from "./staff.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staffs });
    },
  });
};

export const useGetStaffMembers = () => {
  return useQuery({
    queryKey: queryKeys.staffs,
    queryFn: getStaffMembers,
  });
};
