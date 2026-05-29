export const queryKeys = {
  services: (business_id: string) => ["services", business_id],

  service: (business_id: string, id: string) => ["service", business_id, id],

  staffs: (business_id: string) => ["staffs", business_id],

  staff: (business_id: string, id: string) => ["staff", business_id, id],

  bookings: (business_id: string) => ["bookings", business_id],

  booking: (business_id: string, id: string) => ["booking", business_id, id],

  memberships: (business_id: string) => ["memberships", business_id],

  assignedStaff: (business_id: string, id: string) => [
    "assigned-staffs",
    business_id,
    id,
  ],

  unAssignedStaff: (business_id: string, id: string) => [
    "unassigned-staffs",
    business_id,
    id,
  ],

  businesses: (business_id: string) => ["businesses"],

  businessHours: (business_id: string) => ["business-hours", business_id],
};
