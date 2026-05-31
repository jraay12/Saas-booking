import { api } from "../../lib/axios";
import type { CreateBookingRequest, GetBookingsResponse } from "../../types/types";

export const getAvailableSlot = async (
  business_id: string,
  service_id: string,
  staff_id: string,
  date: string,
) => {
  const response = await api.get(`/booking/available/${business_id}`, {
    params: {
      service_id: service_id,
      staff_id: staff_id,
      date: date,
    },
  });
  return response.data.data;
};

export const createBooking = async (
  business_id: string,
  data: CreateBookingRequest,
) => {
  const response = await api.post(`/booking/${business_id}`, data);
  return response.data.data;
};

export const fetchAllBookings = async (): Promise<GetBookingsResponse> => {
  const response = await api.get("/booking");
  return response.data;
};
