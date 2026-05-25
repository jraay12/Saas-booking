export const queryKeys = {
  services: ["services"],
  service: (id: string) => ["service", id],

  staffs: ["staffs"],
  staff: (id: string) => ["staff", id],

  bookings: ["bookings"],
  booking: (id: string) => ["booking", id],

  memberships: ["memberships"],

  businesses: ["businesses"],
};