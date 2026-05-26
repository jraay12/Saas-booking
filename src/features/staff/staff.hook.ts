import { queryKeys } from "../../lib/queryKey";
import { createStaff, getStaffMembers, deleteMembershipStaff } from "./staff.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBusinessId } from "../../lib/decoder";

const businessId = getBusinessId()
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staffs(businessId!) });
    },
  });
};

export const useGetStaffMembers = () => {
  return useQuery({
    queryKey: queryKeys.staffs(businessId!),
    queryFn: getStaffMembers,
  });
};

export const useDeleteMembershipStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMembershipStaff,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs(businessId!),
      });
    },
  });
};