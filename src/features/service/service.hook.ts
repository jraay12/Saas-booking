import { useMutation } from "@tanstack/react-query";
import { createService } from "./service.api";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKey";
import { getBusinessId } from "../../lib/decoder";
export const useCreateService = () => {
  const queryClient = useQueryClient();
  const businessId = getBusinessId()
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.services(businessId)})
    },
  });
};
