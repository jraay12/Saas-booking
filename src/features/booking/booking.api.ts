import { api } from "../../lib/axios";

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
