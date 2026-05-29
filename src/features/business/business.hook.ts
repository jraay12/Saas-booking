import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBusinessId } from "../../lib/decoder";
import { createBusinessHours } from "./business.api";
import { queryKeys } from "../../lib/queryKey";

const businessId = getBusinessId();

export const useCreateBusinessHours = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBusinessHours,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessHours(businessId!),
      });
    },
  });
};
