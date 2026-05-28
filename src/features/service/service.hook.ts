import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createService,
  getAllService,
  toggleStatus,
  updateService,
  getAssignedStaffInService,
  getUnassignedStaffInService,
} from "./service.api";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKey";
import { getBusinessId } from "../../lib/decoder";
const businessId = getBusinessId();

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.services(businessId!),
      });
    },
  });
};

export const useGetAllServices = () => {
  return useQuery({
    queryKey: queryKeys.services(businessId!),
    queryFn: getAllService,
  });
};

export const useToggleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.services(businessId!),
      });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      updateService(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.services(businessId!),
      });
    },
  });
};

export const useGetAllAssignedStaff = (id: string) => {
  return useQuery({
    queryKey: queryKeys.assignedStaff(businessId!, id),
    queryFn: () => getAssignedStaffInService(id),
    enabled: !!id
  });
};

export const useGetAllUnAssignedStaff = (id: string) => {
  return useQuery({
    queryKey: queryKeys.unAssignedStaff(businessId!, id),
    queryFn: () => getUnassignedStaffInService(id),
    enabled: !!id
  });
};
