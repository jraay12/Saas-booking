import { useQuery } from "@tanstack/react-query";
import { myProfile } from "./user.api";
import { queryKeys } from "../../lib/queryKey";

const token = localStorage.getItem("access_token")
export const useFetchMyProfile = () => {
  return useQuery({
    queryFn: myProfile,
    queryKey: queryKeys.profile(),
    enabled: !!token
  });
};
