export type StaffUser = {
  id: string;
  avatar: string | null;
  email: string;
  first_name: string;
  last_name: string;
};

export type StaffMember = {
  id: string;
  user_id: string;
  business_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  user: StaffUser;
};

export type AssignedStaff = {
  id: string;
  service_id: string;
  staff_id: string;
  business_id: string;
  created_at: string;

  staff: StaffUser;
};

export type Service = {
  id: string;
  business_id: string;
  service_name: string;
  category: string;
  description: string;
  price: string;
  hour: number;
  minute: number;
  image_path: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ServiceFormType = Service & {
  cover_image?: File | null;
};

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type BusinessHour = {
  id: string;
  business_id: string;
  day: DayOfWeek;

  open_time: string;
  close_time: string;

  is_closed: boolean;

  created_at: string;
  updated_at: string;
};

export type GetBusinessHoursResponse = BusinessHour[];

export type CreateBookingRequest = {
  service_id: string;
  staff_id: string;

  first_name: string;
  last_name: string;

  email_address: string;
  phone_number: string;

  aditional_notes?: string;

  payment_method: "CASH" | "GCASH";

  booking_date: string;

  service_price: number;

  start_time: string;
};

export interface Booking {
  id: string;
  business_id: string;
  service_id: string;
  staff_id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  aditional_notes: string | null;
  payment_method: "CASH";
  booking_date: string;
  service_price: string;
  start_time: string;
  created_at: string;
  status: "PENDING";

  staff: {
    first_name: string;
    last_name: string;
  };

  service: {
    service_name: string;
  };
}

export interface GetBookingsResponse {
  data: Booking[];
}


export interface Membership {
  role: string
  business_id: string
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  phone: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  memberships: Membership[];
}