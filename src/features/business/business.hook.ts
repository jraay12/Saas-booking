import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBusinessId } from "../../lib/decoder";
import {
  createBusinessHours,
  getBusinessDetailsBySlug,
  getBusinessHours,
} from "./business.api";
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

export const useGetBusinessHours = () => {
  return useQuery({
    queryFn: getBusinessHours,
    queryKey: queryKeys.businessHours(businessId!),
  });
};

export const useGetBusinessDetailsBySlug = (slug: string) => {
  return useQuery({
    queryFn: () => getBusinessDetailsBySlug(slug),
    queryKey: queryKeys.businesses(businessId!),
    enabled: !!slug
  });
};
