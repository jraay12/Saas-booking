import { useQuery } from "@tanstack/react-query";
import { getAvailableSlot } from "./booking.api";
import { queryKeys } from "../../lib/queryKey";

export const useGetAvailableSlot = (
  business_id: string,
  service_id: string,
  staff_id: string,
  date: string,
) => {
  return useQuery({
    queryKey: queryKeys.availableSlots(business_id, service_id, staff_id, date),
    queryFn: () => getAvailableSlot(business_id, service_id, staff_id, date!),
    enabled: !!business_id && !!service_id && !!staff_id && !!date,
  });
};
