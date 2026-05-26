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
  is_active: boolean
  createdAt: string;
  updatedAt: string;
};