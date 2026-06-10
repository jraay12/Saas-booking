import { useMutation, useQuery } from "@tanstack/react-query";
import { myProfile, updateUser } from "./user.api";
import { queryKeys } from "../../lib/queryKey";
import type { UpdateUserDTO } from "../../schema/user";
import { queryClient } from "../../provider/QueryProvider";
import { getBusinessId } from "../../lib/decoder";
const token = localStorage.getItem("access_token");
const businessId = getBusinessId();
export const useFetchMyProfile = () => {
  return useQuery({
    queryFn: myProfile,
    queryKey: queryKeys.profile(),
    enabled: !!token,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs(businessId!),
      });
    },
  });
};
