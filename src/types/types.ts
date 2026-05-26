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