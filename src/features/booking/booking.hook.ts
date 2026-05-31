import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBooking, fetchAllBookings, getAvailableSlot } from "./booking.api";
import { queryKeys } from "../../lib/queryKey";
import type { CreateBookingRequest } from "../../types/types";
import { getBusinessId } from "../../lib/decoder";

const business_id = getBusinessId()
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

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_id,
      data,
    }: {
      business_id: string;
      data: CreateBookingRequest;
    }) => createBooking(business_id, data),
    onSuccess: (_, { business_id, data }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.availableSlots(
          business_id,
          data.service_id,
          data.staff_id,
          data.booking_date,
        ),
      });
    },
  });
};

export const useFetchAllBookings = () => {
 return useQuery({
  queryFn: fetchAllBookings,
  queryKey: queryKeys.bookings(business_id!)
 })
}
