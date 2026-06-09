import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBusinessId } from "../../lib/decoder";
import {
  createBusiness,
  createBusinessHours,
  getBusinessDetailsBySlug,
  getBusinessHours,
  getBusinessHoursPublic,
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

export const useGetBusinessHoursPublic = (business_id: string) => {
  return useQuery({
    queryFn: () => getBusinessHoursPublic(business_id),
    queryKey: queryKeys.businessHours(business_id),
  });
};

export const useGetBusinessDetailsBySlug = (slug: string) => {
  return useQuery({
    queryFn: () => getBusinessDetailsBySlug(slug),
    queryKey: queryKeys.businesses(businessId!),
    enabled: !!slug,
  });
};

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBusiness,
    onSuccess: (data) => {
      console.log(data)
      // queryClient.invalidateQueries({
      //   queryKey: queryKeys.businesses(data),
      // });
    },
  });
};
