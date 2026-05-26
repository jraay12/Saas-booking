import { useMutation, useQuery } from "@tanstack/react-query";
import { createService, getAllService } from "./service.api";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKey";
import { getBusinessId } from "../../lib/decoder";
const businessId = getBusinessId()

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.services(businessId!)})
    },
  });
};

export const useGetAllServices = () => {
  return useQuery({
    queryKey: queryKeys.services(businessId!),
    queryFn: getAllService
  })
}
