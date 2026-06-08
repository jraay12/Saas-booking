import { useQuery } from "@tanstack/react-query";
import { myProfile } from "./user.api";
import { getUserId } from "../../lib/decoder";
import { queryKeys } from "../../lib/queryKey";

const userId = getUserId();
const token = localStorage.getItem("access_token")
export const useFetchMyProfile = () => {
  return useQuery({
    queryFn: myProfile,
    queryKey: queryKeys.profile(userId!),
    enabled: !!token
  });
};
